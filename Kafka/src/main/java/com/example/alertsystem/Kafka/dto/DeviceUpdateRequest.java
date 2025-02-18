package com.example.alertsystem.Kafka.dto;

import java.util.List;

public class DeviceUpdateRequest {
    private List<String> configuration;

    public List<String> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(List<String> configuration) {
        this.configuration = configuration;
    }
}
