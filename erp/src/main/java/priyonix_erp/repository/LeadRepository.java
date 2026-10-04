package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Lead;

public interface LeadRepository extends JpaRepository<Lead, Long> {

}