package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlarmService {

    @Autowired
    private AlarmRepository alarmRepository;

    public Alarm createAlarm(Long deviceId, String criticality, String message) {
        Alarm alarm = new Alarm();
        alarm.setDeviceId(deviceId);
        alarm.setCriticality(criticality);
        alarm.setMessage(message);
        alarm.setResolved(false);
        return alarmRepository.save(alarm);
    }

    public List<Alarm> getAlarmsByDevice(Long deviceId) {
        return alarmRepository.findByDeviceId(deviceId);
    }

    public Alarm resolveAlarm(Long alarmId) {
        return alarmRepository.findById(alarmId).map(alarm -> {
            alarm.setResolved(true);
            return alarmRepository.save(alarm);
        }).orElseThrow(() -> new RuntimeException("Alarm not found"));
    }
}
