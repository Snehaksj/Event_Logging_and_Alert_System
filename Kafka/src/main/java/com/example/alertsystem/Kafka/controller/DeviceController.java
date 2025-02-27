package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import com.example.alertsystem.Kafka.dto.DeviceUpdateRequest;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import com.example.alertsystem.Kafka.repository.UserRepository;
import com.example.alertsystem.Kafka.service.DeviceService;
import com.example.alertsystem.Kafka.service.UserService;
import org.apache.kafka.common.protocol.types.Field;
import org.hibernate.engine.transaction.jta.platform.internal.SynchronizationRegistryBasedSynchronizationStrategy;
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
    private final UserRepository userRepository;

    public DeviceController(DeviceService deviceService, UserService userService, DeviceRepository deviceRepository, UserRepository userRepository) {
        this.deviceService = deviceService;
        this.userService = userService;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
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
    public ResponseEntity<?> getUserDevices(@PathVariable String username) {
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

    @GetMapping("/username/{deviceName}")
    public ResponseEntity<Map<String, String>> getUsernameByDeviceName(@PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();
        try {
            // Find the device by its name
            Optional<Device> deviceOpt = deviceRepository.findByName(deviceName);

            // Check if the device exists
            if (deviceOpt.isPresent()) {
                Device device = deviceOpt.get();

                // Check if the device has a valid userId (optional step depending on your data model)
                Optional<User> userOpt = userRepository.findById(device.getUserId());

                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    response.put("username", user.getUsername());  // Fetch username from the user entity
                    return ResponseEntity.ok(response);
                } else {
                    response.put("message", "User associated with this device not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
            } else {
                response.put("message", "Device not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error finding username");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{deviceName}")
    public ResponseEntity<Map<String, String>> deleteDevice( @PathVariable String deviceName) {
        Map<String, String> response = new HashMap<>();

        deviceService.deleteDevice( deviceName);
        response.put("message", "Device deleted successfully");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }
}
