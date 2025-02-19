package com.example.alertsystem.Kafka.service;
import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.Device;
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

    public Device createDevice(Long userId, String deviceName) {
        Device device = new Device();
        device.setName(deviceName);
        device.setUser(new User());
        device.getUser().setId(userId);
        return deviceRepository.save(device);
    }

    public List<Device> getDevicesByUser(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    public Device updateDevice(Long deviceId, List<String> configuration, User loggedInUser) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        if (!device.getUser().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("Unauthorized to update this device");
        }

        device.setConfiguration(configuration);
        return deviceRepository.save(device);
    }

    public void deleteDevice(Long deviceId, User loggedInUser) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        if (loggedInUser.getRole() == Role.ADMIN || device.getUser().getId().equals(loggedInUser.getId())) {
            deviceRepository.delete(device);
        } else {
            throw new RuntimeException("Unauthorized to delete this device");
        }
    }
}
