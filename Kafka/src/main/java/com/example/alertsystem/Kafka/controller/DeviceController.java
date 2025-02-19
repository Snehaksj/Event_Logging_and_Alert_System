package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import com.example.alertsystem.Kafka.dto.DeviceUpdateRequest;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.service.DeviceService;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final UserService userService;

    public DeviceController(DeviceService deviceService, UserService userService) {
        this.deviceService = deviceService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Device> createDevice(@RequestBody DeviceRequest request, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        Device device = deviceService.createDevice(user.getId(), request.getDeviceName());
        return ResponseEntity.ok(device);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Device>> getUserDevices(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(deviceService.getDevicesByUser(user.getId()));
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long deviceId, @RequestBody DeviceUpdateRequest request, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        Device updatedDevice = deviceService.updateDevice(deviceId, request.getConfiguration(), user);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long deviceId, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        deviceService.deleteDevice(deviceId, user);
        return ResponseEntity.ok("Device deleted successfully");
    }
}
