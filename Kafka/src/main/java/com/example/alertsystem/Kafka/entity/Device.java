package com.example.alertsystem.Kafka.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection
    @CollectionTable(name = "device_configuration", joinColumns = @JoinColumn(name = "device_id"))
    @Column(columnDefinition = "TEXT")
    private List<String> configuration; // Stores JSON strings

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
