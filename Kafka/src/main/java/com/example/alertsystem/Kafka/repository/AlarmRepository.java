package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByDeviceId(Long deviceId);  // ✅ Fix: Correct method
}
