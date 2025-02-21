package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Alarm;
import com.example.alertsystem.Kafka.repository.AlarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlarmService {

    @Autowired
    private AlarmRepository alarmRepository;

    @Autowired
    private EmailService emailService;

    public Alarm createAlarm(Alarm alarm) {
        Alarm savedAlarm = alarmRepository.save(alarm);
        sendAlertEmail(savedAlarm);
        return savedAlarm;
    }

    private void sendAlertEmail(Alarm alarm) {
        String email = getRecipientEmail(alarm.getCriticality());
        String subject = alarm.getCriticality() + " Alert: Immediate Attention Required!";
        String body = "Alarm ID: " + alarm.getId() +
                "\nDevice ID: " + alarm.getDevice().getId() +
                "\nMessage: " + alarm.getMessage() +
                "\nTimestamp: " + alarm.getTimestamp();

        emailService.sendEmail(email, subject, body);
    }

    private String getRecipientEmail(String severity) {
    System.out.println("Getting recipient for severity: " + severity); // Debug log
    switch (severity.toLowerCase()) {
        case "critical": return CRITICAL_TEAM_EMAIL;
        case "high": return HIGH_TEAM_EMAIL;
        case "medium": return MEDIUM_TEAM_EMAIL;
        case "low": return LOW_TEAM_EMAIL;
        default: return null;
    }
}

}
