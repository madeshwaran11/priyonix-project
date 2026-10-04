package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}