package com.example.alertsystem.Kafka.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeviceUpdateRequest {
    private List<String> configuration;
}
