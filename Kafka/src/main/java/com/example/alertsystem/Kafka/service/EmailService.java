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

    // Team emails for different criticality levels
    public static final String CRITICAL_TEAM_EMAIL = "oncall-team@example.com";
    public static final String HIGH_TEAM_EMAIL = "network-team@example.com";
    public static final String MEDIUM_TEAM_EMAIL = "operations@example.com";
    public static final String LOW_TEAM_EMAIL = "monitoring@example.com";

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("❌ Error sending email: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 60000) // Runs every 1 minute
    public void processPendingAlarms() {
        String query = "SELECT * FROM notification_queue WHERE sent = FALSE";
        List<Map<String, Object>> pendingAlerts = jdbcTemplate.queryForList(query);

        if (pendingAlerts.isEmpty()) {
            System.out.println("🔍 No pending alarms to process.");
            return;
        }

        for (Map<String, Object> alert : pendingAlerts) {
            Long alarmId = (Long) alert.get("alarm_id");
            String criticality = (String) alert.get("criticality");
            String message = (String) alert.get("message");
            String email = (String) alert.get("email");
            String type = (String) alert.get("type");

            System.out.println("⚠️ Processing Alarm ID: " + alarmId + " | Type: " + type);

            if ("resolved_ack".equals(type)) {
                // Send acknowledgment to user
                String emailBody = "<h3>✅ Alarm Resolved</h3>"
                        + "<p>Your reported issue has been resolved.</p>"
                        + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                        + "<p><b>Message:</b> " + message + "</p>";

                sendEmail(email, "✅ Alarm Resolved - ID: " + alarmId, emailBody);
            } else {
                // Send alarm notification to respective team
                String recipientEmail = getRecipientEmail(criticality);
                if (recipientEmail == null) {
                    System.out.println("⚠️ Unknown criticality: " + criticality + " | No email sent.");
                    continue;
                }

                String emoji = getCriticalityEmoji(criticality);
                String emailBody = "<h3>🚨 New Alarm Notification</h3>"
                        + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                        + "<p><b>Criticality:</b> " + criticality + "</p>"
                        + "<p><b>Message:</b> " + message + "</p>";

                sendEmail(recipientEmail, emoji + " Alarm Notification - " + criticality, emailBody);
            }

            // Mark as sent
            jdbcTemplate.update("UPDATE notification_queue SET sent = TRUE WHERE id = ?", alert.get("id"));
        }
    }

    private String getRecipientEmail(String criticality) {
        switch (criticality.toLowerCase()) {
            case "critical": return CRITICAL_TEAM_EMAIL;
            case "high": return HIGH_TEAM_EMAIL;
            case "medium": return MEDIUM_TEAM_EMAIL;
            case "low": return LOW_TEAM_EMAIL;
            default: return null;
        }
    }

    private String getCriticalityEmoji(String criticality) {
        switch (criticality.toLowerCase()) {
            case "critical": return "🚨";
            case "high": return "🔴";
            case "medium": return "🟠";
            case "low": return "⚪";
            default: return "❓";
        }
    }
}
