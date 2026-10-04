package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}