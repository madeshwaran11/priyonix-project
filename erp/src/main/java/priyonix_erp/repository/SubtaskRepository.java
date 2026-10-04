package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Subtask;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
}