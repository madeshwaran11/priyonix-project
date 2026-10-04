package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Milestone;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
}