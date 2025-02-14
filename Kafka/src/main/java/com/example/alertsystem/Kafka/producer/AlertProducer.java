package com.example.alertsystem.Kafka.producer;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.example.alertsystem.Kafka.model.Alert;

@Service
public class AlertProducer {

    private final KafkaTemplate<String, Alert> kafkaTemplate;

    public AlertProducer(KafkaTemplate<String, Alert> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendAlert(Alert alert) {
        String topic = switch (alert.getType().toLowerCase()) {
            case "critical" -> "critical-topic";
            case "warning" -> "warning-topic";
            case "general" -> "general-topic";
            default -> throw new IllegalArgumentException("Invalid alert type: " + alert.getType());
        };
        kafkaTemplate.send(topic, alert);
    }
}
