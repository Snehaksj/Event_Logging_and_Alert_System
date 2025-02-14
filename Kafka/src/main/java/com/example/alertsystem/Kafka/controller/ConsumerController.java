package com.example.alertsystem.Kafka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.alertsystem.Kafka.storage.AlertStorage;

import java.util.List;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    private final AlertStorage alertStorage;

    public ConsumerController(AlertStorage alertStorage) {
        this.alertStorage = alertStorage;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<String>> getAlerts() {
        List<String> alerts = alertStorage.getAlerts();
        return ResponseEntity.ok(alerts);
    }

    @DeleteMapping("/alerts")
    public ResponseEntity<String> acknowledgeAlerts() {
        alertStorage.clearAlerts();
        return ResponseEntity.ok("Alerts acknowledged and cleared from memory");
    }
}
