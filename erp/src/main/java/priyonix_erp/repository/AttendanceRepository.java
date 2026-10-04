package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
