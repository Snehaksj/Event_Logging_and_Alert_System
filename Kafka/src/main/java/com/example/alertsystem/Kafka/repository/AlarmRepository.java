package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByDeviceId(Long deviceId);
    Optional<Alarm> findByMessage(String message);
}
