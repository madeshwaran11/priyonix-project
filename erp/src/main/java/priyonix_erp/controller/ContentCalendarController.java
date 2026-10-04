package priyonix_erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.ContentCalendar;
import priyonix_erp.repository.ContentCalendarRepository;

import java.util.List;

@RestController
@RequestMapping("/api/content-calendar")
@CrossOrigin(origins = "http://localhost:5173")
public class ContentCalendarController {

    private final ContentCalendarRepository repository;

    public ContentCalendarController(ContentCalendarRepository repository) {
        this.repository = repository;
    }

    // Get all content calendar items
    @GetMapping
    public List<ContentCalendar> getAll() {
        return repository.findAll();
    }

    // Get one content calendar item
    @GetMapping("/{id}")
    public ResponseEntity<ContentCalendar> getById(@PathVariable Long id) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create content
    @PostMapping
    public ContentCalendar create(@RequestBody ContentCalendar content) {

        if (content.getStatus() == null || content.getStatus().isBlank()) {
            content.setStatus("PLANNED");
        }

        return repository.save(content);
    }

    // Update content
    @PutMapping("/{id}")
    public ResponseEntity<ContentCalendar> update(
            @PathVariable Long id,
            @RequestBody ContentCalendar updated) {

        return repository.findById(id)
                .map(existing -> {

                    existing.setCampaignId(updated.getCampaignId());
                    existing.setContentTitle(updated.getContentTitle());
                    existing.setPlatform(updated.getPlatform());
                    existing.setContentType(updated.getContentType());
                    existing.setScheduledDate(updated.getScheduledDate());
                    existing.setStatus(updated.getStatus());

                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete content
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Content deleted successfully");
    }
}