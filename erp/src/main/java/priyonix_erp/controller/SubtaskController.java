package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.Subtask;
import priyonix_erp.repository.SubtaskRepository;

import java.util.List;

@RestController
@RequestMapping("/api/subtasks")
@CrossOrigin(origins = "*")
public class SubtaskController {

    private final SubtaskRepository subtaskRepository;

    public SubtaskController(SubtaskRepository subtaskRepository) {
        this.subtaskRepository = subtaskRepository;
    }

    @GetMapping
    public List<Subtask> getAllSubtasks() {
        return subtaskRepository.findAll();
    }

    @PostMapping
    public Subtask createSubtask(@RequestBody Subtask subtask) {

        if (subtask.getStatus() == null || subtask.getStatus().isEmpty()) {
            subtask.setStatus("TODO");
        }

        if (subtask.getProgress() == null) {
            subtask.setProgress(0);
        }

        return subtaskRepository.save(subtask);
    }

    @GetMapping("/{id}")
    public Subtask getSubtaskById(@PathVariable Long id) {

        return subtaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
    }

    @PutMapping("/{id}/status")
    public Subtask updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Subtask subtask = subtaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        subtask.setStatus(status);

        return subtaskRepository.save(subtask);
    }

    @PutMapping("/{id}/progress")
    public Subtask updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress) {

        Subtask subtask = subtaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        subtask.setProgress(progress);

        return subtaskRepository.save(subtask);
    }

    @DeleteMapping("/{id}")
    public String deleteSubtask(@PathVariable Long id) {

        subtaskRepository.deleteById(id);

        return "Subtask deleted successfully";
    }
}