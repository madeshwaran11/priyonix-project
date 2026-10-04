package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.Attendance;
import priyonix_erp.repository.AttendanceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {

        if (attendance.getStatus() == null || attendance.getStatus().isEmpty()) {
            attendance.setStatus("PRESENT");
        }

        return attendanceRepository.save(attendance);
    }

    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {

        attendanceRepository.deleteById(id);

        return "Attendance deleted successfully";
    }
}
