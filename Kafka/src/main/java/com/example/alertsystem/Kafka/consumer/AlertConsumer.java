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
        alertStorage.addAlert("CRITICAL: " + alert.getMessage());
    }

    @KafkaListener(topics = "warning-topic", groupId = "alert-group")
    public void consumeWarning(@NotNull Alert alert) {
        alertStorage.addAlert("WARNING: " + alert.getMessage());
    }

    @KafkaListener(topics = "general-topic", groupId = "alert-group")
    public void consumeGeneral(@org.jetbrains.annotations.NotNull Alert alert) {
        alertStorage.addAlert("GENERAL: " + alert.getMessage());
    }
}
