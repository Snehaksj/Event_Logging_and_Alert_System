package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
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

    public Alarm createAlarm(Device device, String criticality, String message) {
        Alarm alarm = new Alarm();
        alarm.setDevice(device);
        alarm.setCriticality(criticality);
        alarm.setMessage(message);
        alarm.setResolved(false);
        alarm.setTimestamp(LocalDateTime.now());

        return alarmRepository.save(alarm);
    }




    public List<Alarm> getAlarmsByDevice(Long deviceId) {
        return alarmRepository.findByDeviceId(deviceId);
    }

    public Alarm resolveAlarm(String message, Long deviceId) {
        Alarm alarm = alarmRepository.findByMessage(message)
                .orElseThrow(() -> new RuntimeException("Alarm not found"));

        if (!alarm.getDevice().getId().equals(deviceId)) {
            throw new RuntimeException("Alarm does not belong to the given device");
        }

        alarm.setResolved(true);
        return alarmRepository.save(alarm);
    }
}
