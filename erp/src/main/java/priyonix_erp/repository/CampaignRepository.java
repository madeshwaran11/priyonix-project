package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
}