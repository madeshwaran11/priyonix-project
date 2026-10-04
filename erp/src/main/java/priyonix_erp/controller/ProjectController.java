package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Project;
import priyonix_erp.repository.ProjectRepository;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {

        if (project.getStatus() == null || project.getStatus().isEmpty()) {
            project.setStatus("PLANNED");
        }

        if (project.getPriority() == null || project.getPriority().isEmpty()) {
            project.setPriority("MEDIUM");
        }

        return projectRepository.save(project);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));
    }

    @PutMapping("/{id}/status")
    public Project updateProjectStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        project.setStatus(status);

        return projectRepository.save(project);
    }

    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {

        projectRepository.deleteById(id);

        return "Project deleted successfully";
    }
}