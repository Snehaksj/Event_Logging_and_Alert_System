package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import com.example.alertsystem.Kafka.dto.DeviceUpdateRequest;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import com.example.alertsystem.Kafka.service.DeviceService;
import com.example.alertsystem.Kafka.service.UserService;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final UserService userService;
    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceService deviceService, UserService userService, DeviceRepository deviceRepository) {
        this.deviceService = deviceService;
        this.userService = userService;
        this.deviceRepository = deviceRepository;
    }

    @PostMapping("/create/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> createDevice(@RequestBody DeviceRequest request, @PathVariable String username, @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try{
            User user = userService.getUserByUsername(username);

                Device device = deviceService.createDevice(user, deviceName, request);
                response.put("message", "Device created successfully");
                response.put("status", "success");

            return ResponseEntity.ok(response);
        }
        catch(Exception e){

            response.put("message","username not found");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Device>> getUserDevices(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();
        User user = userService.getUserByUsername(username);
        try{
        return ResponseEntity.ok(deviceService.getDevicesByUser(user.getId()));
        } catch (Exception e) {
            response.put("message", "Device unavailable");
            response.put("status", "failure");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body((List<Device>) response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceRepository.findAll();
        return ResponseEntity.ok(devices);
    }


    @PutMapping("/edit/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> editDevice(@RequestBody DeviceRequest request, @PathVariable String username, @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try {
            User user = userService.getUserByUsername(username);
            Device device = deviceService.updateDevice(user.getId(), deviceName, request);

            response.put("message", "Device updated successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());  // Return actual error message
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }


    @DeleteMapping("/delete/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> deleteDevice(@PathVariable String username, @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        User user = userService.getUserByUsername(username);

        deviceService.deleteDevice(user.getId(), deviceName);
        response.put("message", "Device deleted successfully");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }
}
