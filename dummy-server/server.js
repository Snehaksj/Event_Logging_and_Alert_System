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


// Function to read Excel file and send records one at a time
async function readExcelAndSendData() {
  // Path to the Excel file (data.xlsx should be in the same directory as server.js)
  const filePath = path.join(__dirname, "data.xlsx");
  const workbook = xlsx.readFile(filePath);
  // Assuming data is in the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  console.log("Excel data loaded. Total records:", jsonData.length);
  for (let index = 0; index < jsonData.length; index++) {
    const record = jsonData[index];
    try {
      // Await axios call to ensure it's asynchronous
      const response = await axios.post(`http://localhost:8080/alert`, record);
      console.log(`Record ${index+1} sent successfully:`, response.data);
    } catch (error) {
      console.error(`Error sending record ${index + 1}:`, error.message);
    }

    // Wait for 10 seconds before sending the next record
    if (index < jsonData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay of 10 seconds
    }
  }

  console.log("All records have been sent.");
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
readExcelAndSendData();
app.listen(PORT, () => {
  console.log(`Dummy server running on port ${PORT}`);
});
