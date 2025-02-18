package com.example.alertsystem.Kafka.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private boolean isAdmin;
}
