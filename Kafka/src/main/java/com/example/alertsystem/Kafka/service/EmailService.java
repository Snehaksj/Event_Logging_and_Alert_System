

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

    /**
     * Sends an email with the given recipient, subject, and body content.
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            System.out.println("📤 Sending email to: " + to);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("❌ Email sending failed: " + e.getMessage());
        }
    }

    /**
     * Processes pending alarms from the `notification_queue`.
     */
    @Scheduled(fixedRate = 60000) // Runs every 1 minute
    public void processPendingAlarms() {
        System.out.println("🔄 Checking `notification_queue` for pending alarms...");

        String query = "SELECT * FROM notification_queue WHERE sent = FALSE";
        List<Map<String, Object>> pendingAlerts = jdbcTemplate.queryForList(query);

        if (pendingAlerts.isEmpty()) {
            System.out.println("✅ No pending alarms.");
            return;
        }

        for (Map<String, Object> alert : pendingAlerts) {
            Long alarmId = ((Number) alert.get("alarm_id")).longValue();
            String criticality = (String) alert.get("criticality");
            String message = (String) alert.get("message");
            String userEmail = (String) alert.get("email");
            String type = (String) alert.get("type");

            System.out.println("⚠️ Processing Alarm ID: " + alarmId);

            if ("resolved_ack".equals(type)) {
                String emailBody = "<h3>✅ Alarm Resolved</h3>"
                        + "<p>Your reported issue has been resolved.</p>"
                        + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                        + "<p><b>Message:</b> " + message + "</p>";

                sendEmail(userEmail, "✅ Alarm Resolved - ID: " + alarmId, emailBody);
            } else {
                String recipientEmail = getRecipientEmail(criticality);
                if (recipientEmail == null) {
                    System.out.println("⚠️ Unknown criticality: " + criticality + " | Skipping...");
                    continue;
                }

                String emoji = getCriticalityEmoji(criticality);
                String emailBody = "<h3>🚨 New Alarm Notification</h3>"
                        + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                        + "<p><b>Criticality:</b> " + criticality + "</p>"
                        + "<p><b>Message:</b> " + message + "</p>";

                sendEmail(recipientEmail, emoji + " Alarm Notification - " + criticality, emailBody);
            }

            int rowsUpdated = jdbcTemplate.update("UPDATE notification_queue SET sent = TRUE WHERE id = ?", alert.get("id"));
            System.out.println("🔄 Updated " + rowsUpdated + " row(s) in `notification_queue`.");
        }
    }

    /**
     * Processes resolved alarms from `resolved_alarms` table.
     */
    @Scheduled(fixedRate = 60000) // Runs every 1 minute
    public void processResolvedAlarms() {
        System.out.println("🔄 Checking `resolved_alarms` for pending notifications...");

        String query = "SELECT id, alarm_id, message, user_email FROM resolved_alarms WHERE sent = FALSE";
        List<Map<String, Object>> resolvedAlarms = jdbcTemplate.queryForList(query);

        if (resolvedAlarms.isEmpty()) {
            System.out.println("✅ No pending resolved alarms.");
            return;
        }

        for (Map<String, Object> alarm : resolvedAlarms) {
            Long alarmId = ((Number) alarm.get("alarm_id")).longValue();
            String message = (String) alarm.get("message");
            String userEmail = (String) alarm.get("user_email");

            if (userEmail == null || userEmail.isEmpty()) {
                System.out.println("❌ No email found for this alarm. Skipping...");
                continue;
            }

            System.out.println("📧 Sending resolution email to: " + userEmail);

            String emailBody = "<h3>✅ Alarm Resolved</h3>"
                    + "<p>Your reported issue has been resolved.</p>"
                    + "<p><b>Alarm ID:</b> " + alarmId + "</p>"
                    + "<p><b>Message:</b> " + message + "</p>";

            sendEmail(userEmail, "✅ Alarm Resolved - ID: " + alarmId, emailBody);

            int rowsUpdated = jdbcTemplate.update("UPDATE resolved_alarms SET sent = TRUE WHERE id = ?", alarm.get("id"));
            System.out.println("🔄 Updated " + rowsUpdated + " row(s) in `resolved_alarms`.");
        }
    }

    /**
     * Determines recipient email based on alarm criticality.
     */
    private String getRecipientEmail(String criticality) {
        switch (criticality.toLowerCase()) {
            case "critical": return "oncall-team@example.com";
            case "high": return "network-team@example.com";
            case "medium": return "operations@example.com";
            case "low": return "monitoring@example.com";
            default: return null;
        }
    }

    /**
     * Returns an emoji representation of alarm criticality.
     */
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
