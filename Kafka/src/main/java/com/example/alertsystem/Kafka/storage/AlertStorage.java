package com.example.alertsystem.Kafka.storage;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlertStorage {

    private final List<String> alerts = new ArrayList<>();

    public synchronized void addAlert(String alert) {
        alerts.add(alert);
    }

    public synchronized List<String> getAlerts() {
        return new ArrayList<>(alerts);
    }

    public synchronized void clearAlerts() {
        alerts.clear();
    }
}
