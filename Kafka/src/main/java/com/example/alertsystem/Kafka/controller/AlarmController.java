package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.AlarmRequest;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import com.example.alertsystem.Kafka.service.AlarmService;
import com.example.alertsystem.Kafka.service.DeviceService;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/alarms")
public class AlarmController {
    private final AlarmService alarmService;
    private final DeviceService deviceService;
    private final UserService userService;
    private final AlarmRepository alarmRepository;
    private final DeviceRepository deviceRepository;

    public AlarmController(AlarmService alarmService, DeviceService deviceService, UserService userService, AlarmRepository alarmRepository, DeviceRepository deviceRepository) {
        this.alarmService = alarmService;
        this.deviceService = deviceService;
        this.userService = userService;
        this.alarmRepository = alarmRepository;
        this.deviceRepository = deviceRepository;
    }

    // 📌 Create Alarm (Pass: username, deviceName)
    @PostMapping("/create/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> createAlarm(@RequestBody AlarmRequest request,
                                                           @PathVariable String username,
                                                           @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try {
            User user;
            Long userId;

            // Check if the username is "admin"
            if (username.equals("admin")) {
                // If admin, fetch the device and retrieve the userId associated with it
                Device device = deviceService.getDeviceByName(deviceName)  // Fetch device by name (admin case)
                        .orElseThrow(() -> new RuntimeException("Device not found"));
                userId = device.getUser().getId();  // Get the user associated with the device
            } else {
                // If not admin, fetch the user by username
                user = userService.getUserByUsername(username);
                userId = user.getId();
            }

            // Fetch the device for the userId and deviceName
            Device device = deviceService.getDeviceByUserAndName(userId, deviceName);

            // Create the alarm
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
    @GetMapping("/{username}")
    public ResponseEntity<List<Alarm>> getAlarmsByDevice(@PathVariable String username) {
        // Fetch user based on username
        User user = userService.getUserByUsername(username);

        // Fetch devices associated with the user
        List<Device> devices = deviceRepository.findByUser_Id(user.getId());

        // Extract the device IDs from the list of devices
        List<Long> deviceIds = devices.stream()
                .map(Device::getId)
                .collect(Collectors.toList());

        // Fetch alarms for those devices
        List<Alarm> alarms = alarmService.getAlarmssByDevice(deviceIds);

        // Return the response with alarms
        return ResponseEntity.ok(alarms);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Alarm>> getAllAlarms() {
        return ResponseEntity.ok(alarmRepository.findAll());
    }

    // 📌 Resolve Alarm (Pass: username, deviceName, alarmId)
    @PutMapping("/resolve/{alarmId}")
    public ResponseEntity<Map<String, String>> resolveAlarm(
                                                            @PathVariable Long alarmId
                                                            ) {
        Map<String, String> response = new HashMap<>();
        try {


            alarmService.resolveAlarm(alarmId);

            response.put("message", "Alarm resolved successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
