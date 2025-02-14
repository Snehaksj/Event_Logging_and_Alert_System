package com.example.alertsystem.Kafka.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.alertsystem.Kafka.model.Alert;
import com.example.alertsystem.Kafka.producer.AlertProducer;
import com.example.alertsystem.Kafka.repository.AlertRepository;

@RestController
@RequestMapping("/alert")
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
}