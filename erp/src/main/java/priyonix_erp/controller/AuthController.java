package priyonix_erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import priyonix_erp.entity.Employee;
import priyonix_erp.repository.EmployeeRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final EmployeeRepository employeeRepository;

    public AuthController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        Employee employee =
                employeeRepository.findByUsername(
                        request.getUsername()
                );

        if (employee == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }

        if (!employee.getPassword()
                .equals(request.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }

        if ("INACTIVE".equalsIgnoreCase(
                employee.getStatus())) {

            return ResponseEntity
                    .status(403)
                    .body("Employee account is inactive");
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", "Login successful");
        response.put("id", employee.getId());
        response.put("name", employee.getName());
        response.put("email", employee.getEmail());
        response.put("username", employee.getUsername());
        response.put("role", employee.getRole());

        return ResponseEntity.ok(response);
    }

    public static class LoginRequest {

        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
