package com.example.alertsystem.Kafka.controller;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import com.example.alertsystem.Kafka.service.AlarmService;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.alertsystem.Kafka.model.Alert;
import com.example.alertsystem.Kafka.producer.AlertProducer;
import com.example.alertsystem.Kafka.repository.AlertRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/alert")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    private final AlertProducer alertProducer;
    private final AlertRepository alertRepository;
    private final UserService userService;
    private final DeviceRepository deviceRepository;
    private final AlarmService alarmService;
    private final AlarmRepository alarmRepository;

    public AlertController(AlertProducer alertProducer, AlertRepository alertRepository, UserService userService, DeviceRepository deviceRepository, AlarmService alarmService, AlarmRepository alarmRepository) {
        this.alertProducer = alertProducer;
        this.alertRepository = alertRepository;
        this.userService = userService;
        this.deviceRepository = deviceRepository;
        this.alarmService = alarmService;
        this.alarmRepository = alarmRepository;
    }

    @PostMapping
    public ResponseEntity<String> publishAlert(@RequestBody Alert alert) {
        alertProducer.sendAlert(alert);
        alertRepository.save(alert); // Save alert to MySQL
        return ResponseEntity.ok("Alert published and saved successfully");
    }

    // Endpoint to get all alerts from the database (GET)
    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();  // Fetch all alerts from DB
        return ResponseEntity.ok(alerts);  // Return list of alerts in JSON format
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Alert>> getAlertsByUsername(@PathVariable String username) {
        // Fetch the user by username
        User user = userService.getUserByUsername(username);

        // Fetch devices associated with the user
        List<Device> devices = deviceRepository.findByUser_Id(user.getId());

        // Extract the device IDs
        List<Long> deviceIds = devices.stream()
                .map(Device::getId)
                .collect(Collectors.toList());

        // Fetch the alerts associated with the devices
        List<Alert> alerts = alertRepository.findByDeviceIdIn(deviceIds);

        // Return the list of alerts
        return ResponseEntity.ok(alerts);
    }


    // Endpoint to get deviceId and message for critical severity alerts (GET)
    @GetMapping("/critical")
    public ResponseEntity<List<Map<String, Object>>> getCriticalAlerts() {

        List<Alarm> criticalAlerts = alarmRepository.findByCriticality("critical");


        List<Map<String, Object>> result = criticalAlerts.stream()
                .map(alarm -> {

                    Map<String, Object> deviceMessage = new HashMap<>();

                    deviceMessage.put("deviceId", alarm.getDevice().getId());
                    deviceMessage.put("message", alarm.getMessage());
                    deviceMessage.put("resolved", alarm.getResolved());
                    return deviceMessage;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);  // Return the list of maps in the response
    }




}