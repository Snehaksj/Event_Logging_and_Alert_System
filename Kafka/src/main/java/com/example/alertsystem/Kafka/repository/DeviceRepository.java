package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUserId(Long userId);
    Optional<Device> findByUserIdAndName(Long userId, String name);
    Optional<Device> findByName(String name);

}
