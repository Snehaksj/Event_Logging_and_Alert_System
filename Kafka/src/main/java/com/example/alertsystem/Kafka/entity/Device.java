package com.example.alertsystem.Kafka.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection // ✅ Store list of configurations
    private List<String> configuration;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getConfiguration() { return configuration; }
    public void setConfiguration(List<String> configuration) { this.configuration = configuration; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
