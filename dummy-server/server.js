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
function readExcelAndSendData() {
  // Path to the Excel file (data.xlsx should be in the same directory as server.js)
  const filePath = path.join(__dirname, "data.xlsx");
  const workbook = xlsx.readFile(filePath);
  // Assuming data is in the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  console.log("Excel data loaded. Total records:", jsonData.length);
  let index = 0;
  const intervalId = setInterval(() => {
    if (index >= jsonData.length) {
      console.log("All records have been sent.");
      clearInterval(intervalId);
      return;
    }
    const record = jsonData[index];
    axios
      .post(`http://localhost:${PORT}/api/events`, record)
      .then((response) => {
        console.log(`Record ${index + 1} sent successfully:`, response.data);
      })
      .catch((error) => {
        console.error(`Error sending record ${index + 1}:`, error.message);
      });
    index++;
  }, 10000); // 10,000 ms = 10 seconds
}

app.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
  // Start sending data once the server is running
  readExcelAndSendData();
});
