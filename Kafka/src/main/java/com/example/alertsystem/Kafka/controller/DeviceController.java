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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @PostMapping("/create-bulk-devices")
    public ResponseEntity<String> createDevicesBulk(@RequestParam("file") MultipartFile file) {
        try {
            List<String> errorMessages = deviceService.saveBulkDevices(file);
            if (errorMessages.isEmpty()) {
                return ResponseEntity.ok("Devices created successfully");
            } else {
                return ResponseEntity.badRequest().body(String.join(", ", errorMessages));
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("An error occurred while processing the file");
        }
    }


    @GetMapping("/user/{username}")
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

    @GetMapping("/{deviceName}")
    public ResponseEntity<?> getDeviceByName(@PathVariable String deviceName) {
        try {
            Optional<Device> device = deviceService.getDeviceByName(deviceName);
            if (device.isPresent()) {
                return ResponseEntity.ok(device.get());
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Device not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // Log the exception for better debugging
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Internal Server Error");
            response.put("error", e.getMessage());  // Include the error message in the response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/create-bulk")
    public ResponseEntity<String> createDevicesBulk(@RequestBody List<Device> devices) {
        deviceService.saveAll(devices);
        return ResponseEntity.ok("Devices created successfully");
    }
    @DeleteMapping("/{deviceId}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long deviceId, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        deviceService.deleteDevice(deviceId, user);
        return ResponseEntity.ok("Device deleted successfully");



    @PutMapping("/edit/{oldUsername}/{username}/{deviceName}")
    public ResponseEntity<Map<String, String>> editDevice(@RequestBody DeviceRequest request, @PathVariable String oldUsername, @PathVariable String username, @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try {
            User oldUser = userService.getUserByUsername(oldUsername);
            User newUser = userService.getUserByUsername(username);
            Device device = deviceService.updateDevice(oldUser.getId(),newUser, deviceName, request);
            response.put("message", "Device updated successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());  // Return actual error message
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }


    @DeleteMapping("/delete/{deviceName}")
    public ResponseEntity<Map<String, String>> deleteDevice( @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();

        deviceService.deleteDevice( deviceName);
        response.put("message", "Device deleted successfully");
        response.put("status", "success");


    }
}
