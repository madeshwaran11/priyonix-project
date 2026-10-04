package priyonix_erp.controller;

import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.LeaveRequest;
import priyonix_erp.repository.LeaveRequestRepository;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestController(
            LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    // Get all leave requests
    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    // Employee submits leave
    @PostMapping
    public LeaveRequest createLeave(
            @RequestBody LeaveRequest leaveRequest) {

        if (leaveRequest.getStatus() == null ||
                leaveRequest.getStatus().isEmpty()) {

            leaveRequest.setStatus("PENDING");
        }

        return leaveRequestRepository.save(leaveRequest);
    }

    // HR approves/rejects leave
    @PutMapping("/{id}/status")
    public LeaveRequest updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Leave request not found"));

        leaveRequest.setStatus(status);

        return leaveRequestRepository.save(leaveRequest);
    }
}
