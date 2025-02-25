package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.AlarmRequest;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import com.example.alertsystem.Kafka.service.AlarmService;
import com.example.alertsystem.Kafka.service.DeviceService;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alarms")
public class AlarmController {

    private final AlarmService alarmService;
    private final DeviceService deviceService;
    private final UserService userService;
    private final AlarmRepository alarmRepository;

    public AlarmController(AlarmService alarmService, DeviceService deviceService, UserService userService, AlarmRepository alarmRepository) {
        this.alarmService = alarmService;
        this.deviceService = deviceService;
        this.userService = userService;
        this.alarmRepository = alarmRepository;
    }

    // 📌 Create Alarm (Pass: username, deviceName)
    @PostMapping("/create/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> createAlarm(@RequestBody AlarmRequest request,
                                                           @PathVariable String username,
                                                           @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try {
            User user = userService.getUserByUsername(username);
            Device device = deviceService.getDeviceByUserAndName(user.getId(), deviceName);

            alarmService.createAlarm(device, request.getCriticality(), request.getMessage());
            response.put("message", "Alarm created successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    // 📌 Get Alarms for a Specific Device (Pass: username, deviceName)
    @GetMapping("/{username}/{deviceName}")
    public ResponseEntity<List<Alarm>> getAlarmsByDevice(@PathVariable String username,
                                                         @PathVariable String deviceName) {
        User user = userService.getUserByUsername(username);
        Device device = deviceService.getDeviceByUserAndName(user.getId(), deviceName);
        return ResponseEntity.ok(alarmService.getAlarmsByDevice(device.getId()));
    }



    @GetMapping("/{deviceId}")
    public ResponseEntity<List<Alarm>> getAlarmsByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(alarmService.getAlarmsByDevice(deviceId));

    @GetMapping("/all")
    public ResponseEntity<List<Alarm>> getAllAlarms() {
        return ResponseEntity.ok(alarmRepository.findAll());

    }

    // 📌 Resolve Alarm (Pass: username, deviceName, alarmId)
    @PutMapping("/resolve/{username}/{deviceName}/{message}")
    public ResponseEntity<Map<String, String>> resolveAlarm(@PathVariable String username,
                                                            @PathVariable String deviceName,
                                                            @PathVariable String message) {
        Map<String, String> response = new HashMap<>();
        try {
            User user = userService.getUserByUsername(username);
            Device device = deviceService.getDeviceByUserAndName(user.getId(), deviceName);
            alarmService.resolveAlarm(message, device.getId());

            response.put("message", "Alarm resolved successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
