package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.ProjectTeam;
import priyonix_erp.repository.ProjectTeamRepository;

import java.util.List;

@RestController
@RequestMapping("/api/project-team")
@CrossOrigin(origins = "*")
public class ProjectTeamController {

    private final ProjectTeamRepository projectTeamRepository;

    public ProjectTeamController(ProjectTeamRepository projectTeamRepository) {
        this.projectTeamRepository = projectTeamRepository;
    }

    @GetMapping
    public List<ProjectTeam> getAllProjectTeam() {
        return projectTeamRepository.findAll();
    }

    @PostMapping
    public ProjectTeam addProjectTeam(@RequestBody ProjectTeam projectTeam) {
        return projectTeamRepository.save(projectTeam);
    }

    @GetMapping("/{id}")
    public ProjectTeam getProjectTeamById(@PathVariable Long id) {
        return projectTeamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project team member not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteProjectTeam(@PathVariable Long id) {
        projectTeamRepository.deleteById(id);
        return "Project team member deleted successfully";
    }
}