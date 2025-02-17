package com.example.alertsystem.Kafka.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.alertsystem.Kafka.model.Alert;
import com.example.alertsystem.Kafka.producer.AlertProducer;
import com.example.alertsystem.Kafka.repository.AlertRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/alert")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    private final AlertProducer alertProducer;
    private final AlertRepository alertRepository;

    public AlertController(AlertProducer alertProducer, AlertRepository alertRepository) {
        this.alertProducer = alertProducer;
        this.alertRepository = alertRepository;
    }

    @PostMapping
    public ResponseEntity<String> publishAlert(@RequestBody Alert alert) {
        alertProducer.sendAlert(alert);
        alertRepository.save(alert); // Save alert to MySQL
        return ResponseEntity.ok("Alert published and saved successfully");
    }
    // Endpoint to get all alerts from the database (GET)
    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();  // Fetch all alerts from DB
        return ResponseEntity.ok(alerts);  // Return list of alerts in JSON format
    }

    // Endpoint to get deviceId and message for critical severity alerts (GET)
    @GetMapping("/critical")
    public ResponseEntity<List<DeviceMessage>> getCriticalAlerts() {
        List<Alert> criticalAlerts = alertRepository.findBySeverity("critical");  // Fetch critical alerts

        // Map critical alerts to a list of DeviceMessage objects containing only deviceId and message
        List<DeviceMessage> deviceMessages = criticalAlerts.stream()
                .map(alert -> new DeviceMessage(alert.getDeviceId(), alert.getMessage()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(deviceMessages);  // Return filtered data in JSON format
    }

    // Custom DTO (Data Transfer Object) for critical alerts
    public static class DeviceMessage {
        private String deviceId;
        private String message;

        // Constructor
        public DeviceMessage(String deviceId, String message) {
            this.deviceId = deviceId;
            this.message = message;
        }

        // Getters and Setters
        public String getDeviceId() {
            return deviceId;
        }

        public void setDeviceId(String deviceId) {
            this.deviceId = deviceId;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}