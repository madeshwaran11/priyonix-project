package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.Milestone;
import priyonix_erp.repository.MilestoneRepository;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
@CrossOrigin(origins = "*")
public class MilestoneController {

    private final MilestoneRepository milestoneRepository;

    public MilestoneController(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    @GetMapping
    public List<Milestone> getAllMilestones() {
        return milestoneRepository.findAll();
    }

    @PostMapping
    public Milestone createMilestone(@RequestBody Milestone milestone) {

        if (milestone.getStatus() == null || milestone.getStatus().isEmpty()) {
            milestone.setStatus("PLANNED");
        }

        if (milestone.getProgress() == null) {
            milestone.setProgress(0);
        }

        return milestoneRepository.save(milestone);
    }

    @GetMapping("/{id}")
    public Milestone getMilestoneById(@PathVariable Long id) {

        return milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
    }

    @PutMapping("/{id}/status")
    public Milestone updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        milestone.setStatus(status);

        return milestoneRepository.save(milestone);
    }

    @PutMapping("/{id}/progress")
    public Milestone updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress) {

        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        milestone.setProgress(progress);

        return milestoneRepository.save(milestone);
    }

    @DeleteMapping("/{id}")
    public String deleteMilestone(@PathVariable Long id) {

        milestoneRepository.deleteById(id);

        return "Milestone deleted successfully";
    }
}