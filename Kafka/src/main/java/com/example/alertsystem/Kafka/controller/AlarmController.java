package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.AlarmRequest;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.service.AlarmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alarms")
public class AlarmController {

    private final AlarmService alarmService;

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @PostMapping("/create")
    public ResponseEntity<Alarm> createAlarm(@RequestBody AlarmRequest request) {
        Alarm alarm = alarmService.createAlarm(request.getDeviceId(), request.getCriticality(), request.getMessage());
        return ResponseEntity.ok(alarm);
    }


    @GetMapping("/{deviceId}")
    public ResponseEntity<List<Alarm>> getAlarmsByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(alarmService.getAlarmsByDevice(deviceId));
    }

    @PutMapping("/{alarmId}/resolve")
    public ResponseEntity<Alarm> resolveAlarm(@PathVariable Long alarmId) {
        Alarm resolvedAlarm = alarmService.resolveAlarm(alarmId);
        return ResponseEntity.ok(resolvedAlarm);
    }
}
