const express = require("express");
const axios = require("axios");
const xlsx = require("xlsx");

const app = express();
app.use(express.json());

const workbook = xlsx.readFile("data.xlsx");
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const API_URL = "https://localhost:3306/notify/";

const sendData = async (item, index) => {
  try {
    const response = await axios.post(API_URL, item);
    console.log(`Sent row ${index + 1}:`, response.data);
  } catch (error) {
    console.error(`Error sending row ${index + 1}:`, error.message);
  }
};

const processWithDelay = async () => {
  for (let i = 0; i < data.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 60000));
    await sendData(data[i], i);
  }
};

processWithDelay();
console.log("Started processing data...");

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
