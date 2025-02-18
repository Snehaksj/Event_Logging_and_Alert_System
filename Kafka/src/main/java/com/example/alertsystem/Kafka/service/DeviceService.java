public Device createDevice(Long userId, String deviceName) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Device device = new Device();
    device.setName(deviceName);
    device.setConfiguration(List.of()); // Default empty list
    device.setUser(user);

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
