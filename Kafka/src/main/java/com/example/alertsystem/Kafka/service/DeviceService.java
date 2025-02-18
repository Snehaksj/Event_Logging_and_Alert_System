package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public void deleteDevice(Long deviceId, User user) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Check if the device belongs to the user before deleting (optional)
        if (!device.getUser().getId().equals(user.getId())) { // Corrected from getUserId() to getUser().getId()
            throw new RuntimeException("User not authorized to delete this device");
        }

        deviceRepository.delete(device);
    }

    public Device createDevice(Long userId, String deviceName) {
        // Assuming you have a Device entity with userId and deviceName fields
        Device device = new Device();
        // You no longer need to set userId directly since you have the User relationship in Device
        User user = new User();
        user.setId(userId); // Assuming User exists with this id
        device.setUser(user);  // Set the user directly

        device.setName(deviceName); // Updated method to set name

        // Save the device to the repository
        return deviceRepository.save(device);
    }

    public Device updateDevice(Long deviceId, List<String> configuration, User user) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Ensure only the owner or admin can update the device
        if (!device.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized to update this device");
        }

        device.setConfiguration(configuration); // Update the configuration
        return deviceRepository.save(device);
    }
}
