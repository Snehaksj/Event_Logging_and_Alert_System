import express from 'express';
import axios from 'axios';
import xlsx from 'xlsx';
import schedule from 'node-schedule';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Function to fetch data from the APIs
const fetchData = async () => {
    try {
        // Fetch alert data
        const alertUrl = "http://localhost:8080/alert";
        const alertsResponse = await axios.get(alertUrl);
        const alertsData = alertsResponse.data;

        // Fetch alarm data
        const alarmsUrl = "http://localhost:8080/alarms/all";
        const alarmsResponse = await axios.get(alarmsUrl);
        const alarmsData = alarmsResponse.data;

        // Check if data was fetched successfully
        if (alertsResponse.status === 200 && alarmsResponse.status === 200) {
            console.log("Data fetched successfully.");

            // Prepare data for Excel
            const alertSheet = xlsx.utils.json_to_sheet(alertsData);
            const alarmSheet = xlsx.utils.json_to_sheet(alarmsData);

            // Create a workbook and append the data to separate sheets
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, alertSheet, 'Alerts');
            xlsx.utils.book_append_sheet(wb, alarmSheet, 'Alarms');

            // Generate timestamp for the file name
            const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 15);
            const fileName = path.join(__dirname, `backup_${timestamp}.xlsx`);

            // Write workbook to file
            xlsx.writeFile(wb, fileName);
            console.log(`Data successfully written to ${fileName}`);
        } else {
            console.log("Failed to fetch data from one or both APIs.");
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
};

// Schedule the backup every 1 minute
schedule.scheduleJob('*/1 * * * *', fetchData); // Runs every minute

// Basic Express server to confirm the service is up
app.get('/', (req, res) => {
    res.send('Backup service is running');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
