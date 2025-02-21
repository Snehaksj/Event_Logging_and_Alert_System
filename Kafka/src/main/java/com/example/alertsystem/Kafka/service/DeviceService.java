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
    public void saveAll(List<Device> devices) {
        deviceRepository.saveAll(devices);
    }
    public Device createDevice(User user, DeviceRequest request) {
        Device device = new Device();
        device.setName(request.getDeviceName());
        device.setUser(user);
        return deviceRepository.save(device);
    }

    public List<Device> getDevicesByUser(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    public Device updateDevice(Long deviceId, DeviceUpdateRequest request, User user) {
        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);
        if (optionalDevice.isPresent()) {
            Device device = optionalDevice.get();
            if (device.getUser().getId().equals(user.getId())) {
                device.setConfiguration(request.getConfiguration());
                return deviceRepository.save(device);
            } else {
                throw new RuntimeException("Unauthorized to update this device.");
            }
        } else {
            throw new RuntimeException("Device not found.");
        }
    }

    public void deleteDevice(Long deviceId, User user) {
        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);
        if (optionalDevice.isPresent()) {
            Device device = optionalDevice.get();
            if (device.getUser().getId().equals(user.getId())) {
                deviceRepository.delete(device);
            } else {
                throw new RuntimeException("Unauthorized to delete this device.");
            }
        } else {
            throw new RuntimeException("Device not found.");
        }
    }
}
