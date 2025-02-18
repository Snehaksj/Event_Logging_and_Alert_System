# Event Logging and Alert System

This project is a logging and alert system that monitors network events, analyzes traffic data, and generates real-time alerts based on severity levels.

## Features

- 📜 Logs network events with timestamps and device details
- 📊 Displays traffic graphs for visualization
- 🚨 Alerts based on event severity (**Critical, Major, Minor, Warning, Info**)
- 📡 Handles real-time packet loss and latency monitoring
- 🔍 Implements a search and filtering system for event logs
- 📈 Provides a radar chart for latency visualization
- 📉 Includes a bar chart for packet loss monitoring
- 🔄 Uses real-time **Server-Sent Events (SSE)** for live updates
- 📑 Reads data from an **Excel file** and sends records to an external API
- 🔧 Generates dynamic traffic data and maintains historical traffic values
- 🎯 Integrates **Kafka messaging service** for alert processing


## Usage 🛠️

- 🖥️ The dashboard displays event logs and traffic statistics.
- 🔎 Users can **filter and search** logs for specific event types.
- 🌈 Alerts are **color-coded** based on severity.
- ⚡ **Real-time updates** occur every 5 seconds.
- 📡 The server reads data from an **Excel file** and sends it to an external API.
- 🔄 Traffic and network data are **dynamically updated** and streamed using SSE.
- 📨 Kafka is used for **messaging and event-driven alert processing**.

## Kafka Messaging Service 📨

The system integrates Kafka for real-time alert processing:

- **Producers**: Alerts are published to specific Kafka topics based on severity.
- **Consumers**: The system listens to Kafka topics and processes alerts accordingly.
- **Topics:**
  - 🟥 `critical-topic` → Critical alerts
  - 🟧 `warning-topic` → Warning alerts
  - 🟨 `major-topic` → Major alerts
  - 🟩 `minor-topic` → Minor alerts
  - 🔵 `info-topic` → Informational alerts

## File Structure 📂

### 📌 Frontend:
- 📜 `Dashboard.js` → Main component integrating different monitoring components.
- 📊 `TrafficGraph.js` → Line chart component for real-time network traffic analysis.
- 📃 `Event.js` → Displays event logs with filtering and sorting features.
- 🚨 `Alarm.js` → Handles alert notifications based on severity.
- 📉 `PacketLoss.js` → Monitors packet loss metrics.
- 📡 `Latency.js` → Monitors latency using a **radar chart** and real-time updates via **SSE**.
- 🧭 `Nav.js` → Navigation bar for the application.
- 📊 `PacketLossBarChart.js` → Bar chart for packet loss monitoring.

### 🖥️ Backend:
- ⚙️ `server.js` → Express server handling event logging, real-time streaming, and Excel file processing.
- 📑 `data.xlsx` → Excel file containing records sent to an external API.
- 📂 `routes/` → API routes for handling events and traffic data.
- 📂 `controllers/` → Business logic for event handling and data processing.
- 🛠️ `utils/` → Helper functions for processing network data.
- 📨 `Kafka/producer/AlertProducer.java` → Kafka producer service for publishing alerts.
- 📥 `Kafka/consumer/AlertConsumer.java` → Kafka consumer service for processing alerts.
- 🌐 `Kafka/controller/AlertController.java` → REST API for managing alerts.

## API Integration 🔗

- The system fetches event data from an API endpoint (`http://localhost:8080/alert`) every **5 seconds** using `axios`.
- Latency data is retrieved using **Server-Sent Events** (`http://localhost:3000/api/live-data`).
- The backend **reads records from an Excel file** and sends them to an external API every **5 seconds**.

## 📸 Screenshot

![Dashboard](https://github.com/aakilshihafv/EventLoggingAlert/blob/main/image/Dashboard.png)

## Contributing 🤝

Feel free to **fork** this repository, add features, and **submit pull requests**.

## 📜 License

This project is licensed under the **MIT License**. See the LICENSE file for details.

