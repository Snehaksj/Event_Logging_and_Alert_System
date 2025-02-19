package com.example.alertsystem.Kafka.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
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
}
