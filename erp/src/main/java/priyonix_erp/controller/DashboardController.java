package priyonix_erp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import priyonix_erp.entity.Campaign;
import priyonix_erp.entity.Invoice;
import priyonix_erp.entity.Project;

import priyonix_erp.repository.AttendanceRepository;
import priyonix_erp.repository.CampaignRepository;
import priyonix_erp.repository.ClientRepository;
import priyonix_erp.repository.EmployeeRepository;
import priyonix_erp.repository.ExpenseRepository;
import priyonix_erp.repository.InvoiceRepository;
import priyonix_erp.repository.LeadRepository;
import priyonix_erp.repository.LeaveRequestRepository;
import priyonix_erp.repository.MilestoneRepository;
import priyonix_erp.repository.ProjectRepository;
import priyonix_erp.repository.SubtaskRepository;
import priyonix_erp.repository.TaskRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeadRepository leadRepository;
    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final InvoiceRepository invoiceRepository;
    private final CampaignRepository campaignRepository;
    private final ExpenseRepository expenseRepository;
    private final AttendanceRepository attendanceRepository;
    private final MilestoneRepository milestoneRepository;
    private final SubtaskRepository subtaskRepository;

    public DashboardController(
            EmployeeRepository employeeRepository,
            LeaveRequestRepository leaveRequestRepository,
            LeadRepository leadRepository,
            ClientRepository clientRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            InvoiceRepository invoiceRepository,
            CampaignRepository campaignRepository,
            ExpenseRepository expenseRepository,
            AttendanceRepository attendanceRepository,
            MilestoneRepository milestoneRepository,
            SubtaskRepository subtaskRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leadRepository = leadRepository;
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.invoiceRepository = invoiceRepository;
        this.campaignRepository = campaignRepository;
        this.expenseRepository = expenseRepository;
        this.attendanceRepository = attendanceRepository;
        this.milestoneRepository = milestoneRepository;
        this.subtaskRepository = subtaskRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        LocalDate today = LocalDate.now();

        /* =========================================
           LOAD DATA
        ========================================= */

        var employees = employeeRepository.findAll();
        var leaveRequests = leaveRequestRepository.findAll();
        var leads = leadRepository.findAll();
        var clients = clientRepository.findAll();
        var projects = projectRepository.findAll();
        var tasks = taskRepository.findAll();
        var invoices = invoiceRepository.findAll();
        var campaigns = campaignRepository.findAll();
        var expenses = expenseRepository.findAll();
        var attendance = attendanceRepository.findAll();
        var milestones = milestoneRepository.findAll();
        var subtasks = subtaskRepository.findAll();

        /* =========================================
           BASIC COUNTS
        ========================================= */

        data.put("employees", employees.size());
        data.put("leaveRequests", leaveRequests.size());
        data.put("leads", leads.size());
        data.put("clients", clients.size());
        data.put("projects", projects.size());
        data.put("tasks", tasks.size());
        data.put("invoices", invoices.size());
        data.put("campaigns", campaigns.size());
        data.put("expenses", expenses.size());
        data.put("attendance", attendance.size());
        data.put("milestones", milestones.size());
        data.put("subtasks", subtasks.size());

        /* =========================================
           PENDING LEAVES
        ========================================= */

        long pendingLeaves = leaveRequests.stream()
                .filter(leave ->
                        "PENDING".equalsIgnoreCase(
                                leave.getStatus()
                        )
                )
                .count();

        data.put("pendingLeaves", pendingLeaves);

        /* =========================================
           ACTIVE PROJECTS
        ========================================= */

        long activeProjects = projects.stream()
                .filter(project ->
                        "IN_PROGRESS".equalsIgnoreCase(
                                project.getStatus()
                        )
                        ||
                        "ACTIVE".equalsIgnoreCase(
                                project.getStatus()
                        )
                )
                .count();

        data.put("activeProjects", activeProjects);

        /* =========================================
           DELAYED PROJECTS
        ========================================= */

        long delayedProjects = projects.stream()
                .filter(project -> {

                    LocalDate endDate =
                            parseDate(project.getEndDate());

                    return endDate != null
                            && endDate.isBefore(today)
                            && !"COMPLETED".equalsIgnoreCase(
                                    project.getStatus()
                            );
                })
                .count();

        data.put("delayedProjects", delayedProjects);

        /* =========================================
           OPEN TASKS
        ========================================= */

        long openTasks = tasks.stream()
                .filter(task ->
                        !"COMPLETED".equalsIgnoreCase(
                                task.getStatus()
                        )
                )
                .count();

        data.put("openTasks", openTasks);

        /* =========================================
           OVERDUE TASKS
        ========================================= */

        long overdueTasks = tasks.stream()
                .filter(task -> {

                    LocalDate dueDate =
                            parseDate(task.getDueDate());

                    return dueDate != null
                            && dueDate.isBefore(today)
                            && !"COMPLETED".equalsIgnoreCase(
                                    task.getStatus()
                            );
                })
                .count();

        data.put("overdueTasks", overdueTasks);

        /* =========================================
           ACTIVE CAMPAIGNS
        ========================================= */

        long activeCampaigns = campaigns.stream()
                .filter(campaign ->
                        "ACTIVE".equalsIgnoreCase(
                                campaign.getStatus()
                        )
                )
                .count();

        data.put("activeCampaigns", activeCampaigns);

        /* =========================================
           CONVERTED LEADS
        ========================================= */

        long convertedLeads = leads.stream()
                .filter(lead ->
                        "CONVERTED".equalsIgnoreCase(
                                lead.getStatus()
                        )
                )
                .count();

        data.put("convertedLeads", convertedLeads);

        /* =========================================
           FINANCE
        ========================================= */

        double revenue = invoices.stream()
                .mapToDouble(invoice ->
                        invoice.getPaidAmount() == null
                                ? 0.0
                                : invoice.getPaidAmount()
                )
                .sum();

        double invoiceAmount = invoices.stream()
                .mapToDouble(invoice ->
                        invoice.getAmount() == null
                                ? 0.0
                                : invoice.getAmount()
                )
                .sum();

        double outstandingAmount = invoices.stream()
                .mapToDouble(invoice -> {

                    double amount =
                            invoice.getAmount() == null
                                    ? 0.0
                                    : invoice.getAmount();

                    double paid =
                            invoice.getPaidAmount() == null
                                    ? 0.0
                                    : invoice.getPaidAmount();

                    return Math.max(
                            amount - paid,
                            0.0
                    );
                })
                .sum();

        data.put("revenue", revenue);
        data.put("invoiceAmount", invoiceAmount);
        data.put(
                "outstandingAmount",
                outstandingAmount
        );

        /* =========================================
           OVERDUE INVOICES
        ========================================= */

        long overdueInvoices = invoices.stream()
                .filter(invoice -> {

                    LocalDate dueDate =
                            parseDate(invoice.getDueDate());

                    return dueDate != null
                            && dueDate.isBefore(today)
                            && !"PAID".equalsIgnoreCase(
                                    invoice.getPaymentStatus()
                            );
                })
                .count();

        data.put(
                "overdueInvoices",
                overdueInvoices
        );

        /* =========================================
           TOTAL EXPENSES
        ========================================= */

        double totalExpenses = expenses.stream()
                .mapToDouble(expense ->
                        expense.getAmount() == null
                                ? 0.0
                                : expense.getAmount()
                )
                .sum();

        data.put(
                "totalExpenses",
                totalExpenses
        );

        /* =========================================
           PROFIT
        ========================================= */

        double profit =
                revenue - totalExpenses;

        data.put(
                "profit",
                profit
        );

        /* =========================================
           MARKETING SPEND
        ========================================= */

        double marketingSpend = campaigns.stream()
                .mapToDouble(campaign ->
                        campaign.getSpend() == null
                                ? 0.0
                                : campaign.getSpend()
                )
                .sum();

        data.put(
                "marketingSpend",
                marketingSpend
        );

        /* =========================================
           CAMPAIGN PERFORMANCE
        ========================================= */

        List<Map<String, Object>>
                campaignPerformance =
                new ArrayList<>();

        for (Campaign campaign : campaigns) {

            Map<String, Object> item =
                    new HashMap<>();

            item.put(
                    "id",
                    campaign.getId()
            );

            item.put(
                    "campaignName",
                    campaign.getCampaignName()
            );

            item.put(
                    "platform",
                    campaign.getPlatform()
            );

            item.put(
                    "reach",
                    campaign.getReach()
            );

            item.put(
                    "engagement",
                    campaign.getEngagement()
            );

            item.put(
                    "conversions",
                    campaign.getConversions()
            );

            item.put(
                    "spend",
                    campaign.getSpend()
            );

            campaignPerformance.add(item);
        }

        data.put(
                "campaignPerformance",
                campaignPerformance
        );

        /* =========================================
           PROJECT-WISE REVENUE
        ========================================= */

        Map<Long, Double>
                revenueByProject =
                new HashMap<>();

        for (Invoice invoice : invoices) {

            Long projectId =
                    invoice.getProjectId();

            if (projectId == null) {
                continue;
            }

            double paid =
                    invoice.getPaidAmount() == null
                            ? 0.0
                            : invoice.getPaidAmount();

            revenueByProject.put(
                    projectId,
                    revenueByProject.getOrDefault(
                            projectId,
                            0.0
                    ) + paid
            );
        }

        List<Map<String, Object>>
                projectRevenue =
                new ArrayList<>();

        for (Project project : projects) {

            Map<String, Object> item =
                    new HashMap<>();

            item.put(
                    "projectId",
                    project.getId()
            );

            item.put(
                    "projectName",
                    project.getProjectName()
            );

            item.put(
                    "revenue",
                    revenueByProject.getOrDefault(
                            project.getId(),
                            0.0
                    )
            );

            projectRevenue.add(item);
        }

        data.put(
                "projectRevenue",
                projectRevenue
        );

        /* =========================================
           RETURN DASHBOARD DATA
        ========================================= */

        return data;
    }

    /* =============================================
       DATE PARSER

       Your Project, Task and Invoice entities
       store dates as String.

       Example:
       "2026-10-10"
    ============================================= */

    private LocalDate parseDate(String date) {

        if (date == null || date.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(
                    date.trim()
            );

        } catch (Exception e) {

            return null;
        }
    }
}