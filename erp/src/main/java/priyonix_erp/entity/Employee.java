package priyonix_erp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String username;

    private String password;

    private String role;

    private String department;

    private String designation;

    private String joiningDate;

    private String skills;

    private String reportingManager;

    private String status;


    // Get ID
    public Long getId() {
        return id;
    }


    // Get Name
    public String getName() {
        return name;
    }

    // Set Name
    public void setName(String name) {
        this.name = name;
    }


    // Get Email
    public String getEmail() {
        return email;
    }

    // Set Email
    public void setEmail(String email) {
        this.email = email;
    }


    // Get Username
    public String getUsername() {
        return username;
    }

    // Set Username
    public void setUsername(String username) {
        this.username = username;
    }


    // Get Password
    public String getPassword() {
        return password;
    }

    // Set Password
    public void setPassword(String password) {
        this.password = password;
    }


    // Get Role
    public String getRole() {
        return role;
    }

    // Set Role
    public void setRole(String role) {
        this.role = role;
    }


    // Get Department
    public String getDepartment() {
        return department;
    }

    // Set Department
    public void setDepartment(String department) {
        this.department = department;
    }


    // Get Designation
    public String getDesignation() {
        return designation;
    }

    // Set Designation
    public void setDesignation(String designation) {
        this.designation = designation;
    }


    // Get Joining Date
    public String getJoiningDate() {
        return joiningDate;
    }

    // Set Joining Date
    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }


    // Get Skills
    public String getSkills() {
        return skills;
    }

    // Set Skills
    public void setSkills(String skills) {
        this.skills = skills;
    }


    // Get Reporting Manager
    public String getReportingManager() {
        return reportingManager;
    }

    // Set Reporting Manager
    public void setReportingManager(String reportingManager) {
        this.reportingManager = reportingManager;
    }


    // Get Status
    public String getStatus() {
        return status;
    }

    // Set Status
    public void setStatus(String status) {
        this.status = status;
    }
}