package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Campaign;
import priyonix_erp.repository.CampaignRepository;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
public class CampaignController {

    private final CampaignRepository campaignRepository;

    public CampaignController(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    @PostMapping
    public Campaign createCampaign(@RequestBody Campaign campaign) {

        if (campaign.getSpend() == null) {
            campaign.setSpend(0.0);
        }

        if (campaign.getReach() == null) {
            campaign.setReach(0);
        }

        if (campaign.getEngagement() == null) {
            campaign.setEngagement(0);
        }

        if (campaign.getConversions() == null) {
            campaign.setConversions(0);
        }

        if (campaign.getStatus() == null || campaign.getStatus().isEmpty()) {
            campaign.setStatus("PLANNED");
        }

        return campaignRepository.save(campaign);
    }

    @GetMapping("/{id}")
    public Campaign getCampaignById(@PathVariable Long id) {

        return campaignRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Campaign not found"));
    }

    @PutMapping("/{id}/status")
    public Campaign updateCampaignStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Campaign not found"));

        campaign.setStatus(status);

        return campaignRepository.save(campaign);
    }

    @DeleteMapping("/{id}")
    public String deleteCampaign(@PathVariable Long id) {

        campaignRepository.deleteById(id);

        return "Campaign deleted successfully";
    }
}