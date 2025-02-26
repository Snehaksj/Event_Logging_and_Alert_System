package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByDevice_IdIn(List<Long> deviceIds);
    List<Alarm> findByDevice_Id(Long deviceId);
    Optional<Alarm> findByMessage(String message);


    List<Alarm> findByCriticality(String critical);
}
