package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import com.example.alertsystem.Kafka.dto.DeviceUpdateRequest;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }


    public Device createDevice(User user, String deviceName, DeviceRequest request) {

        Device device = new Device();
        device.setName(deviceName);
        device.setUser(user);
        if (request.getConfiguration() != null) {
            device.setConfiguration(request.getConfiguration());
        } else {
            // Set default configuration or empty list if no config is provided
            device.setConfiguration(List.of("default-config"));
        }

        // Save the device to the repository
        return deviceRepository.save(device);
    }

    public Device updateDevice(Long userId, String deviceName, DeviceRequest request) {
        List<Device> devices = deviceRepository.findByUserId(userId);
        Optional<Device> optionalDevice = devices.stream()
                .filter(device -> device.getName().equals(deviceName))
                .findFirst();

        if (optionalDevice.isPresent()) {
            Device device = optionalDevice.get();
            device.setConfiguration(request.getConfiguration() != null ? request.getConfiguration() : List.of("default-config"));
            return deviceRepository.save(device);
        } else {
            throw new RuntimeException("Device not found for the given user.");
        }
    }



    public List<Device> getDevicesByUser(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    public void deleteDevice(Long userId, String deviceName) {
        Optional<Device> optionalDevice = deviceRepository.findByUserIdAndName(userId, deviceName);

        if (optionalDevice.isEmpty()) {
            throw new RuntimeException("Device not found for the given user.");
        }

        Device device = optionalDevice.get();
        deviceRepository.delete(device);
    }



}
