package com.example.alertsystem.Kafka.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private boolean isAdmin;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, boolean isAdmin) {
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
}
