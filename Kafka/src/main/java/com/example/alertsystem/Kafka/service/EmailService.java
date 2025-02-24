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

    // Define recipient emails for different severity levels
    public static final String CRITICAL_TEAM_EMAIL = "oncall-team@example.com";
    public static final String HIGH_TEAM_EMAIL = "network-team@example.com";
    public static final String MEDIUM_TEAM_EMAIL = "operations@example.com";
    public static final String LOW_TEAM_EMAIL = "monitoring@example.com";

    /**
     * Sends an email to the recipient.
     *
     * @param to      Recipient email address.
     * @param subject Email subject.
     * @param body    Email body content.
     */
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

    /**
     * Periodically checks the `notification_queue` table for unsent alarms
     * and processes them by sending an email.
     */
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
            String severity = (String) alert.get("severity");
            String message = (String) alert.get("message");

            System.out.println("⚠️ Processing Alarm ID: " + alarmId + " | Severity: " + severity);

            String recipientEmail = getRecipientEmail(severity);
            if (recipientEmail == null) {
                System.out.println("⚠️ Unknown severity: " + severity + " | No email sent.");
                continue;
            }

            String emoji = getSeverityEmoji(severity);
            String emailBody = "<h3>🚨 New Alarm Notification</h3>"
                    + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                    + "<p><b>Severity:</b> " + severity + "</p>"
                    + "<p><b>Message:</b> " + message + "</p>";

            sendEmail(recipientEmail, emoji + " Alarm Notification - " + severity, emailBody);

            // Mark the alarm as sent in the database
            jdbcTemplate.update("UPDATE notification_queue SET sent = TRUE WHERE id = ?", alert.get("id"));
        }
    }

    /**
     * Gets the appropriate recipient email based on severity level.
     *
     * @param severity The severity level of the alarm.
     * @return The corresponding team email.
     */
    private String getRecipientEmail(String severity) {
        System.out.println("📩 Getting recipient for severity: " + severity);
        switch (severity.toLowerCase()) {
            case "critical": return CRITICAL_TEAM_EMAIL;
            case "high": return HIGH_TEAM_EMAIL;
            case "medium": return MEDIUM_TEAM_EMAIL;
            case "low": return LOW_TEAM_EMAIL;
            default: return null;
        }
    }

    /**
     * Returns the appropriate emoji for the severity level.
     *
     * @param severity The severity level.
     * @return The corresponding emoji.
     */
    private String getSeverityEmoji(String severity) {
        switch (severity.toLowerCase()) {
            case "critical": return "🚨";
            case "high": return "🔴";
            case "medium": return "🟠";
            case "low": return "⚪";
            default: return "❓";
        }
    }
}
