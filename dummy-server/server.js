const express = require("express");
const axios = require("axios");
const xlsx = require("xlsx");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Allow React frontend (or you can use '*' to allow all origins)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));


let clients = [];
let trafficClients = [];

let trafficHistory = [100, 300, 200, 300, 250, 400, 350]; // Initial dataset

// Endpoint to receive events
app.post("/api/events", (req, res) => {
  console.log("Received event:", req.body);
  res.status(200).json({ message: "Event received" });
});



// Function to fetch devices from the backend
async function fetchDevices() {
  const url = 'http://localhost:8080/devices/all'; // URL to get the devices
  try {
    const response = await axios.get(url); // Fetch device data
    return response.data; // Return the devices array from the response
  } catch (error) {
    console.error('Error fetching devices:', error);
    return []; // Return an empty array in case of error
  }
}

// Severity-specific message pools
const messagePools = {
  INFO: [
    'Device connected successfully', 'System initialized', 'Login attempt successful',
    'Routine check completed', 'Normal operation', 'Configuration applied successfully'
  ],
  CRITICAL: [
    'System failure', 'Security breach detected', 'Unauthorized access attempt',
    'Critical error occurred', 'Malware detected', 'Data loss detected'
  ],
  MAJOR: [
    'Device offline', 'High load detected', 'Memory threshold exceeded', 
    'CPU usage high', 'System resource running low', 'Potential security risk'
  ],
  MINOR: [
    'Warning: Low disk space', 'Device rebooted', 'User login detected',
    'Minor configuration change', 'User logged out', 'Service restarted'
  ],
  WARNING: [
    'Connection unstable', 'Slow response detected', 'Unexpected behavior observed',
    'Limited access detected', 'Service response delayed', 'Minor issue detected'
  ]
};
async function generateAndSendData() {
  let eventIdCounter = 1001; // Start eventId from E1001

  // Continuously generate and send data every 5 seconds
  setInterval(async () => {
    const devices = await fetchDevices(); // Fetch devices every 5 seconds

    // If no devices are fetched, exit the function
    if (devices.length === 0) {
      console.log('No devices available');
      return;
    }

    const eventTypes = [
      'FAILED_LOGIN', 'DEVICE_ONLINE', 'TRAFFIC_SPIKE', 'DEVICE_OFFLINE',
      'SECURITY_BREACH', 'SUCCESSFUL_LOGIN'
    ];

    const severities = ['CRITICAL', 'MAJOR', 'WARNING', 'INFO', 'MINOR'];
    const severity = severities[Math.floor(Math.random() * severities.length)]; // Random severity

    const eventData = {
      eventId: `E${eventIdCounter++}`,  // Increment eventId for each event
      timestamp: new Date().toISOString(),
      deviceId: devices[Math.floor(Math.random() * devices.length)].id, // Random device id from fetched devices
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)], // Random event type
      ipAddress: `192.168.1.${Math.floor(Math.random() * 100) + 1}`, // Random IP address
      severity: severity, // Random severity
      message: messagePools[severity][Math.floor(Math.random() * messagePools[severity].length)] // Random message from the severity pool
    };

    // Save critical event in both alert and alarm tables
    if (severity === 'CRITICAL') {
      try {
        // Save to alerts table (existing logic)
        const responseAlert = await axios.post('http://localhost:8080/alert', eventData);
        console.log(`Critical event sent to alerts table: ${eventData.eventId}`, responseAlert.data);

        // Find the device by ID
        const device = devices.find(dev => dev.id === eventData.deviceId); // Find the device by ID
        if (device) {
          // Fetch username by device name
          const deviceName = device.name; // Assuming device has a `name` field
          const response = await axios.get(`http://localhost:8080/devices/username/${deviceName}`);
          
          if (response.status === 200) {
            const username = response.data.username;  // Extract username from the response
            console.log(username)
            // Prepare the alarm data
            const alarmData = {
              deviceId: device.id,
              criticality: eventData.severity,
              message: eventData.message,
              severity: eventData.severity
            };


            // Send the critical event to the `createAlarm` route dynamically
            await axios.post(`http://localhost:8080/alarms/create/${username}/${deviceName}`, alarmData);
            console.log(`Critical event sent to alarms table: ${eventData.eventId}`);
          } else {
            console.error('Error fetching username for device:', deviceName);
          }
        }
      } catch (error) {
        console.error(`Error saving critical event (ID: ${eventData.eventId}):`, error.message);
      }
    } else {
      // For non-critical events, save only to alerts table
      try {
        const response = await axios.post('http://localhost:8080/alert', eventData);
        console.log(`Event sent to alerts table: ${eventData.eventId}`, response.data);
      } catch (error) {
        console.error(`Error sending event ${eventData.eventId} to alerts:`, error.message);
      }
    }

  }, 5000); // Generate and send event every 5 seconds
}













// Endpoint to send real-time data to clients
app.get("/api/live-data", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
});

// Endpoint to send traffic data
app.get("/api/live-traffic", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  trafficClients.push(res);

  req.on("close", () => {
    trafficClients = trafficClients.filter(client => client !== res);
  });
});

// Function to send live network data
function sendLiveData() {
  if (clients.length > 0) {
    const dynamicData = {
      timestamp: new Date().toISOString(),
      latency: Math.floor(Math.random() * 500), // Random latency (0-500ms)
      packetLoss: Math.floor(Math.random() * 100), // Random packet loss (0-100%)
      ipCount: Math.floor(Math.random() * 50) + 1, // Random IP count (1-50)
    };

    clients.forEach(client => client.write(`data: ${JSON.stringify(dynamicData)}\n\n`));
    console.log("Sent live data:", dynamicData);
  }

  setTimeout(sendLiveData, 5000);

}

// Function to send dynamic traffic data
function sendTrafficData() {
  if (trafficClients.length > 0) {
    const newTrafficValue = Math.floor(Math.random() * 390);
    
    // Maintain last 7 values in history
    trafficHistory = [...trafficHistory.slice(1), newTrafficValue];

    const trafficData = {
      timestamp: new Date().toISOString(),
      trafficValues: trafficHistory,
    };

    trafficClients.forEach(client => client.write(`data: ${JSON.stringify(trafficData)}\n\n`));
    console.log("Sent traffic data:", trafficData);
  }

  setTimeout(sendTrafficData, 5000);
}

// Start sending data when the server starts
sendLiveData();
sendTrafficData();

// Call the function to start generating and sending data
generateAndSendData();
app.listen(PORT, () => {
  console.log(`Dummy server running on port ${PORT}`);
});
