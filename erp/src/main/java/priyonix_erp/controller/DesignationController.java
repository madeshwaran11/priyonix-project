package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.Designation;
import priyonix_erp.repository.DesignationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@CrossOrigin(origins = "*")
public class DesignationController {

    private final DesignationRepository designationRepository;

    public DesignationController(DesignationRepository designationRepository) {
        this.designationRepository = designationRepository;
    }

    @GetMapping
    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }

    @PostMapping
    public Designation addDesignation(@RequestBody Designation designation) {
        return designationRepository.save(designation);
    }

    @GetMapping("/{id}")
    public Designation getDesignationById(@PathVariable Long id) {
        return designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteDesignation(@PathVariable Long id) {
        designationRepository.deleteById(id);
        return "Designation deleted successfully";
    }
}