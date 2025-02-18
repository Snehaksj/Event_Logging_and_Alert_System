package com.example.alertsystem.Kafka.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlarmRequest {
    private Long deviceId;
    private String criticality;
    private String message;
}
