package com.example.alertsystem.Kafka.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    private String criticality;
    private String message;
    private boolean resolved;
    private LocalDateTime timestamp;

    // Default Constructor
    public Alarm() {}

    // Parameterized Constructor
    public Alarm(Device device, String criticality, String message, boolean resolved, LocalDateTime timestamp) {
        this.device = device;
        this.criticality = criticality;
        this.message = message;
        this.resolved = resolved;
        this.timestamp = timestamp;
    }

    // ✅ Explicit Getters and Setters
    public Long getId() {
        return id;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public String getCriticality() {
        return criticality;
    }

    public void setCriticality(String criticality) {
        this.criticality = criticality;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
