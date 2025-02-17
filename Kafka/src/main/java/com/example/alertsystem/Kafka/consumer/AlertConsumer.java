package com.example.alertsystem.Kafka.consumer;

import org.jetbrains.annotations.NotNull;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.example.alertsystem.Kafka.model.Alert;
import com.example.alertsystem.Kafka.storage.AlertStorage;

@Service
public class AlertConsumer {

    private final AlertStorage alertStorage;

    public AlertConsumer(AlertStorage alertStorage) {
        this.alertStorage = alertStorage;
    }

    @KafkaListener(topics = "critical-topic", groupId = "alert-group")
    public void consumeCritical(@NotNull Alert alert) {
        alertStorage.addAlert(alert);
    }

    @KafkaListener(topics = "warning-topic", groupId = "alert-group")
    public void consumeWarning(@NotNull Alert alert) {
        alertStorage.addAlert(alert);
    }

    @KafkaListener(topics = "major-topic", groupId = "alert-group")
    public void consumeMajor(@org.jetbrains.annotations.NotNull Alert alert) {
        alertStorage.addAlert(alert);
    }

    @KafkaListener(topics = "minor-topic", groupId = "alert-group")
    public void consumeMinor(@org.jetbrains.annotations.NotNull Alert alert) {
        alertStorage.addAlert(alert);
    }

    @KafkaListener(topics = "info-topic", groupId = "alert-group")
    public void consumeInfo(@org.jetbrains.annotations.NotNull Alert alert) {
        alertStorage.addAlert(alert);
    }
}
