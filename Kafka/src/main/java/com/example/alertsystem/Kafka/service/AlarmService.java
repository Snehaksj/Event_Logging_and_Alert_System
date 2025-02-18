public Alarm createAlarm(Long deviceId, String criticality, String message) {
    Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));

    Alarm alarm = new Alarm();
    alarm.setDevice(device);
    alarm.setCriticality(criticality);
    alarm.setMessage(message);
    alarm.setTimestamp(LocalDateTime.now()); // Capture the timestamp

    return alarmRepository.save(alarm);
}
