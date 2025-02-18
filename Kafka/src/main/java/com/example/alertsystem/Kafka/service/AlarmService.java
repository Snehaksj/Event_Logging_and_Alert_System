package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.dto.AlarmRequest;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.service.AlarmService;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final DeviceRepository deviceRepository;

    public AlarmService(AlarmRepository alarmRepository, DeviceRepository deviceRepository) {
        this.alarmRepository = alarmRepository;
        this.deviceRepository = deviceRepository;
    }

    public Alarm createAlarm(Long deviceId, String criticality, String message) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        Alarm alarm = new Alarm();
        alarm.setDevice(device);
        alarm.setCriticality(criticality);
        alarm.setMessage(message);
        alarm.setResolved(false); // Default to unresolved
        alarm.setTimestamp(LocalDateTime.now());

        return alarmRepository.save(alarm);
    }

    public List<Alarm> getAlarmsByDevice(Long deviceId) {
        return alarmRepository.findByDeviceId(deviceId);
    }

    public Alarm resolveAlarm(Long alarmId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("Alarm not found"));
        alarm.setResolved(true);
        return alarmRepository.save(alarm);
    }
}
