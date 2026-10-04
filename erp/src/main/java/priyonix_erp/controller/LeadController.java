package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;

import priyonix_erp.entity.Client;
import priyonix_erp.entity.Lead;
import priyonix_erp.repository.ClientRepository;
import priyonix_erp.repository.LeadRepository;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    private final LeadRepository leadRepository;
    private final ClientRepository clientRepository;

    public LeadController(
            LeadRepository leadRepository,
            ClientRepository clientRepository) {

        this.leadRepository = leadRepository;
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {

        if (lead.getStatus() == null || lead.getStatus().isEmpty()) {
            lead.setStatus("NEW");
        }

        return leadRepository.save(lead);
    }

    @PutMapping("/{id}/status")
    public Lead updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setStatus(status);

        return leadRepository.save(lead);
    }

    @PostMapping("/{id}/convert")
    public Client convertLeadToClient(@PathVariable Long id) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        Client client = new Client();

        client.setCompanyName(lead.getCompanyName());
        client.setContactName(lead.getContactName());
        client.setEmail(lead.getEmail());
        client.setPhone(lead.getPhone());
        client.setIndustry("IT");
        client.setAddress("");
        client.setStatus("ACTIVE");

        Client savedClient = clientRepository.save(client);

        lead.setStatus("CONVERTED");
        leadRepository.save(lead);

        return savedClient;
    }
}