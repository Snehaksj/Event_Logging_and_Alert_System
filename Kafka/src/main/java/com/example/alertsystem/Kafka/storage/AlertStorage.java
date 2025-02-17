package com.example.alertsystem.Kafka.storage;

import com.example.alertsystem.Kafka.model.Alert;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlertStorage {

    private final List<String> alerts = new ArrayList<>();

    public synchronized void addAlert(Alert alert) {
        alerts.add(alert.getEventId()+alert.getTimestamp()+alert.getDeviceId()+ alert.getEventType()+alert.getIpAddress()+alert.getSeverity()+alert.getMessage());
    }

    public synchronized List<String> getAlerts() {
        return new ArrayList<>(alerts);
    }

    public synchronized void clearAlerts() {
        alerts.clear();
    }
}
