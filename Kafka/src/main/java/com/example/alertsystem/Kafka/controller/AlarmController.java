@RestController
@RequestMapping("/alarms")
public class AlarmController {
    private final AlarmService alarmService;

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAlarm(@RequestBody AlarmRequest request) {
        Alarm alarm = alarmService.createAlarm(request.getDeviceId(), request.getCriticality(), request.getMessage());
        return ResponseEntity.ok(alarm);
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<List<Alarm>> getAlarmsByDevice(@PathVariable Long deviceId) {
        return ResponseEntity.ok(alarmService.getAlarmsByDevice(deviceId));
    }

    @PutMapping("/{alarmId}/resolve")
    public ResponseEntity<?> resolveAlarm(@PathVariable Long alarmId) {
        return ResponseEntity.ok(alarmService.resolveAlarm(alarmId));
    }
}
