package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByDevice(Device device);
}
