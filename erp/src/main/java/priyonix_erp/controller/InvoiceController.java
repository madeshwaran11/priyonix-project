package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Invoice;
import priyonix_erp.repository.InvoiceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {

        if (invoice.getPaidAmount() == null) {
            invoice.setPaidAmount(0.0);
        }

        if (invoice.getPaymentStatus() == null ||
                invoice.getPaymentStatus().isEmpty()) {
            invoice.setPaymentStatus("PENDING");
        }

        return invoiceRepository.save(invoice);
    }

    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable Long id) {

        return invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));
    }

    @PutMapping("/{id}/payment")
    public Invoice updatePayment(
            @PathVariable Long id,
            @RequestParam Double paidAmount) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        invoice.setPaidAmount(paidAmount);

        if (paidAmount >= invoice.getAmount()) {
            invoice.setPaymentStatus("PAID");
        } else if (paidAmount > 0) {
            invoice.setPaymentStatus("PARTIAL");
        } else {
            invoice.setPaymentStatus("PENDING");
        }

        return invoiceRepository.save(invoice);
    }

    @DeleteMapping("/{id}")
    public String deleteInvoice(@PathVariable Long id) {

        invoiceRepository.deleteById(id);

        return "Invoice deleted successfully";
    }
}