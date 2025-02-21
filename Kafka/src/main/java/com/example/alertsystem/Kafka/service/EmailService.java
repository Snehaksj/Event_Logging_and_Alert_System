package com.example.alertsystem.Kafka.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String CRITICAL_TEAM_EMAIL = "oncall-team@example.com";
    private static final String HIGH_TEAM_EMAIL = "network-team@example.com";
    private static final String MEDIUM_TEAM_EMAIL = "operations@example.com";
    private static final String LOW_TEAM_EMAIL = "monitoring@example.com";

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 60000) // Runs every 1 minute
public void processPendingAlarms() {
    String query = "SELECT * FROM notification_queue WHERE sent = FALSE";
    List<Map<String, Object>> pendingAlerts = jdbcTemplate.queryForList(query);

    if (pendingAlerts.isEmpty()) {
        System.out.println("No pending alarms to process.");
    }

    for (Map<String, Object> alert : pendingAlerts) {
        Long alarmId = (Long) alert.get("alarm_id");
        String severity = (String) alert.get("severity");
        String message = (String) alert.get("message");

        System.out.println("Processing Alarm ID: " + alarmId + " Severity: " + severity); // Debug log

        String recipientEmail = getRecipientEmail(severity);
        if (recipientEmail == null) {
            System.out.println("Unknown severity: " + severity);
            continue;
        }

        String emailBody = "<h3>New Alarm Notification</h3>"
                + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                + "<p><b>Severity:</b> " + severity + "</p>"
                + "<p><b>Message:</b> " + message + "</p>";

        sendEmail(recipientEmail, "Alarm Notification - " + severity, emailBody);

        jdbcTemplate.update("UPDATE notification_queue SET sent = TRUE WHERE id = ?", alert.get("id"));
    }
}

