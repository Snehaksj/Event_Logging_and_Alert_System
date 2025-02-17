import express from "express";
import axios from "axios";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

// Set up __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to receive events
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
      const response = await axios.post(`http://localhost:${PORT}/api/events`, record);
      console.log(`Record ${index+1} sent successfully:`, response.data);
    } catch (error) {
      console.error(`Error sending record ${index + 1}:`, error.message);
    }

    // Wait for 10 seconds before sending the next record
    if (index < jsonData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Delay of 10 seconds
    }
  }

  console.log("All records have been sent.");
}

app.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
  // Start sending data once the server is running
  readExcelAndSendData();
});
