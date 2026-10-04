package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Designation;

public interface DesignationRepository extends JpaRepository<Designation, Long> {
}