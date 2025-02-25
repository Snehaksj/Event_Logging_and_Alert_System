package com.example.alertsystem.Kafka.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlarmService {

    @Autowired
    private AlarmRepository alarmRepository;


    @Autowired
    private JdbcTemplate jdbcTemplate;


    public Alarm createAlarm(Device device, String criticality, String message) {

        Alarm alarm = new Alarm();
        alarm.setDeviceId(deviceId);
        alarm.setCriticality(criticality);
        alarm.setMessage(message);
        alarm.setResolved(false);

        alarm.setTimestamp(LocalDateTime.now());


        return alarmRepository.save(alarm);
    }




    public List<Alarm> getAlarmsByDevice(Long deviceId) {
        return alarmRepository.findByDeviceId(deviceId); // ✅ Fetch alarms by device ID
    }

    public Alarm resolveAlarm(Long alarmId) {
        Optional<Alarm> optionalAlarm = alarmRepository.findById(alarmId);
        if (optionalAlarm.isPresent()) {
            Alarm alarm = optionalAlarm.get();
            if (!alarm.getResolved()) {
                alarm.setResolved(true);
                alarmRepository.save(alarm);


                // Insert acknowledgment into notification queue using `username` as email
                String query = "INSERT INTO notification_queue (alarm_id, email, sent, type, message, criticality) " +
                        "SELECT ?, u.username, FALSE, 'resolved_ack', ?, ? " +
                        "FROM devices d " +
                        "JOIN users u ON d.user_id = u.id " +  // `username` is treated as email
                        "WHERE d.id = ?";
                jdbcTemplate.update(query, alarm.getId(), alarm.getMessage(), alarm.getCriticality(), alarm.getDeviceId());
            }
            return alarm;
        } else {
            throw new RuntimeException("Alarm not found");
        }
    }



    public Alarm resolveAlarm2(String message, Long deviceId) {
        Alarm alarm = alarmRepository.findByMessage(message)
                .orElseThrow(() -> new RuntimeException("Alarm not found"));

        if (!alarm.getDevice().getId().equals(deviceId)) {
            throw new RuntimeException("Alarm does not belong to the given device");
        }

        alarm.setResolved(true);
        return alarmRepository.save(alarm);
    }

}
