package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Client;
import priyonix_erp.repository.ClientRepository;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {

        if (client.getStatus() == null || client.getStatus().isEmpty()) {
            client.setStatus("ACTIVE");
        }

        return clientRepository.save(client);
    }

    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Long id) {

        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Client not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteClient(@PathVariable Long id) {

        clientRepository.deleteById(id);

        return "Client deleted successfully";
    }
}