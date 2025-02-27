package com.example.alertsystem.Kafka.entity;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true)  // Ensure the device name is unique
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    private List<String> configuration;

    public Device() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<String> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(List<String> configuration) {
        this.configuration = configuration;
    }

    public Long getUserId(){return this.user.getId();}


}
