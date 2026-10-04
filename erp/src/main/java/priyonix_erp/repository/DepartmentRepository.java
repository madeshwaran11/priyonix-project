package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}