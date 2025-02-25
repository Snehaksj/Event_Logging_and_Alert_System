package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.dto.DeviceRequest;
import com.example.alertsystem.Kafka.dto.DeviceUpdateRequest;
import com.example.alertsystem.Kafka.entity.Device;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.DeviceRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final UserService userService;

    public DeviceService(DeviceRepository deviceRepository, UserService userService) {
        this.deviceRepository = deviceRepository;
        this.userService = userService;
    }

    public void saveAll(List<Device> devices) {
        deviceRepository.saveAll(devices);
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

    public List<String> saveBulkDevices(MultipartFile file) throws IOException {
        List<String> errorMessages = new ArrayList<>();
        List<Device> devicesToSave = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);  // Read the first sheet

        // Create a set to store device names from the Excel file to check for duplicates
        Set<String> excelDeviceNames = new HashSet<>();

        // Iterate through rows to extract device information
        for (Row row : sheet) {
            try {
                // Extract cell-wise data assuming:
                // Column 0: Device Name
                // Column 1: Username
                // Column 2: IP Address
                // Column 3: RAM
                // Column 4: MAC Address
                // Column 5: Software Version
                // Column 6: Transport

                String deviceName = row.getCell(0).getStringCellValue(); // Device Name
                String username = row.getCell(1).getStringCellValue(); // Username
                String ipAddress = row.getCell(2).getStringCellValue(); // IP Address
                String ram = row.getCell(3).getStringCellValue(); // RAM
                String macAddress = row.getCell(4).getStringCellValue(); // MAC Address
                String softwareVersion = row.getCell(5).getStringCellValue(); // Software Version
                String transport = row.getCell(6).getStringCellValue(); // Transport
                System.out.println("" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +
                        "" +username+"  "+ deviceName+
                        "");
                // Validation: Check if the device name already exists in the Excel file (to prevent duplicates)
                if (excelDeviceNames.contains(deviceName)) {
                    errorMessages.add("Duplicate device name in the file: " + deviceName);
                    continue;  // Skip this device if it is a duplicate
                }
                excelDeviceNames.add(deviceName);

                // Validate the username: Check if the user exists
                User user = userService.getUserByUsername(username);
                if (user == null) {
                    errorMessages.add("User not found for device: " + deviceName);
                    continue;  // Skip this device if the user doesn't exist
                }

                // Build the configuration list for the device
                List<String> configuration = new ArrayList<>();
                configuration.add(ipAddress);
                configuration.add(ram);
                configuration.add(macAddress);
                configuration.add(softwareVersion);
                configuration.add(transport);

                // Create the Device object and set its properties
                Device device = new Device();
                device.setName(deviceName);
                device.setUser(user);
                device.setConfiguration(configuration);  // Set the configuration list

                devicesToSave.add(device);  // Add the valid device to the list
            } catch (Exception e) {
                // Handle any exception that occurs while processing a row
                errorMessages.add("Error processing row for device: " + row.getCell(0).getStringCellValue() + ". " + e.getMessage());
            }
        }

        // If there are no errors, save the devices to the database
        if (errorMessages.isEmpty()) {
            saveAll(devicesToSave);  // Save all valid devices to the database
        }

        return errorMessages;  // Return any errors encountered
    }

    // Save all valid devices
    private void saveAll(List<Device> devicesToSave) {
        deviceRepository.saveAll(devicesToSave);
    }


    public Device updateDevice(Long userId,User newUser, String deviceName, DeviceRequest request) {
        List<Device> devices = deviceRepository.findByUserId(userId);
        Optional<Device> optionalDevice = devices.stream()
                .filter(device -> device.getName().equals(deviceName))
                .findFirst();

        if (optionalDevice.isPresent()) {
            Device device = optionalDevice.get();
            device.setUser(newUser);
            device.setConfiguration(request.getConfiguration() != null ? request.getConfiguration() : List.of("default-config"));
            return deviceRepository.save(device);
        } else {
            throw new RuntimeException("Device not found for the given user.");
        }
    }

    public Optional<Device> getDeviceByName(String deviceName) {
        // Attempt to find the device by its name
        return deviceRepository.findByName(deviceName);
    }


    public List<Device> getDevicesByUser(Long userId) {
        return deviceRepository.findByUserId(userId);
    }
    public Device getDeviceByUserAndName(Long userId, String deviceName) {
        return deviceRepository.findByUserIdAndName(userId, deviceName)
                .orElseThrow(() -> new RuntimeException("Device not found"));
    }

    public void deleteDevice( String deviceName) {
        Optional<Device> optionalDevice = deviceRepository.findByName( deviceName);

        if (optionalDevice.isEmpty()) {
            throw new RuntimeException("Device not found for the given user.");
        }

        Device device = optionalDevice.get();
        deviceRepository.delete(device);
    }



}
