package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Employee findByUsername(String username);

}