package priyonix_erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import priyonix_erp.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}