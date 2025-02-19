package com.example.alertsystem.Kafka.dto;

public class AlarmRequest {
    private Long deviceId;
    private String criticality;
    private String message;
    public Long getDeviceId() {
        return deviceId;
    }

    public String getCriticality() {
        return criticality;
    }

    public String getMessage() {
        return message;
    }

}
