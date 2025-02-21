package com.example.alertsystem.Kafka.dto;

import java.util.List;

public class DeviceRequest {
    private String deviceName;
    private List<String> configuration;
    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }
    public List<String> getConfiguration(){
        return configuration;
    }
    public void setConfiguration(List<String> config){
        this.configuration=config;
    }
}
