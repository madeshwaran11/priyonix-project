package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Task;
import priyonix_erp.repository.TaskRepository;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {

        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("TODO");
        }

        if (task.getPriority() == null || task.getPriority().isEmpty()) {
            task.setPriority("MEDIUM");
        }

        if (task.getProgress() == null) {
            task.setProgress(0);
        }

        return taskRepository.save(task);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));
    }

    @PutMapping("/{id}/status")
    public Task updateTaskStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setStatus(status);

        return taskRepository.save(task);
    }

    @PutMapping("/{id}/progress")
    public Task updateTaskProgress(
            @PathVariable Long id,
            @RequestParam Integer progress) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setProgress(progress);

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        taskRepository.deleteById(id);

        return "Task deleted successfully";
    }
}