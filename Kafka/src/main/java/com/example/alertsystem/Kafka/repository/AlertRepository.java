package com.example.alertsystem.Kafka.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.alertsystem.Kafka.model.Alert;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findBySeverity(String severity);
}
