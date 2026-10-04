import { useEffect, useState } from "react";
import api from "../api";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        designation: "",
        joiningDate: "",
        skills: "",
        reportingManager: "",
        status: "ACTIVE",
        username: "",
        password: "",
        role: "EMPLOYEE"
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            const [employeeRes, departmentRes, designationRes] =
                await Promise.all([
                    api.get("/employees"),
                    api.get("/departments"),
                    api.get("/designations")
                ]);

            setEmployees(employeeRes.data);
            setDepartments(departmentRes.data);
            setDesignations(designationRes.data);

        } catch (err) {
            console.error(err);
            setError("Failed to load employee data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addEmployee = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !form.name ||
            !form.email ||
            !form.department ||
            !form.designation ||
            !form.joiningDate ||
            !form.username ||
            !form.password ||
            !form.role
        ) {
            setError("Please fill all required fields");
            return;
        }

        try {
            await api.post("/employees", form);

            setMessage("Employee and login account created successfully!");

            setForm({
                name: "",
                email: "",
                department: "",
                designation: "",
                joiningDate: "",
                skills: "",
                reportingManager: "",
                status: "ACTIVE",
                username: "",
                password: "",
                role: "EMPLOYEE"
            });

            loadData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data ||
                "Failed to create employee"
            );
        }
    };

    const deleteEmployee = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/employees/${id}`);

            setMessage("Employee deleted successfully");

            loadData();

        } catch (err) {
            console.error(err);

            setError(
                "Unable to delete employee. This employee may be used in other modules."
            );
        }
    };

    return (
        <div>

            <h2>Employee Management</h2>

            <p>
                Create employees and their ERP login accounts.
            </p>

            {/* Messages */}

            {error && (
                <div
                    style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}
                >
                    {error}
                </div>
            )}

            {message && (
                <div
                    style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}
                >
                    {message}
                </div>
            )}

            {/* Add Employee */}

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "30px"
                }}
            >

                <h3>Add Employee</h3>

                <form onSubmit={addEmployee}>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "15px"
                        }}
                    >

                        {/* Name */}

                        <div>
                            <label>Name *</label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Employee name"
                                style={inputStyle}
                            />
                        </div>

                        {/* Email */}

                        <div>
                            <label>Email *</label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="employee@example.com"
                                style={inputStyle}
                            />
                        </div>

                        {/* Department */}

                        <div>
                            <label>Department *</label>

                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Department
                                </option>

                                {departments.map((department) => (
                                    <option
                                        key={department.id}
                                        value={
                                            department.departmentName ||
                                            department.name
                                        }
                                    >
                                        {
                                            department.departmentName ||
                                            department.name
                                        }
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation */}

                        <div>
                            <label>Designation *</label>

                            <select
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Designation
                                </option>

                                {designations.map((designation) => (
                                    <option
                                        key={designation.id}
                                        value={
                                            designation.designationName ||
                                            designation.name
                                        }
                                    >
                                        {
                                            designation.designationName ||
                                            designation.name
                                        }
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Joining Date */}

                        <div>
                            <label>Joining Date *</label>

                            <input
                                type="date"
                                name="joiningDate"
                                value={form.joiningDate}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        {/* Skills */}

                        <div>
                            <label>Skills</label>

                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="Java, React, AWS"
                                style={inputStyle}
                            />
                        </div>

                        {/* Reporting Manager */}

                        <div>
                            <label>Reporting Manager</label>

                            <input
                                name="reportingManager"
                                value={form.reportingManager}
                                onChange={handleChange}
                                placeholder="Manager name"
                                style={inputStyle}
                            />
                        </div>

                        {/* Status */}

                        <div>
                            <label>Status</label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* Login Section */}

                    <hr style={{ margin: "25px 0" }} />

                    <h3>ERP Login Account</h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "15px"
                        }}
                    >

                        {/* Username */}

                        <div>
                            <label>Username *</label>

                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Username"
                                style={inputStyle}
                            />
                        </div>

                        {/* Password */}

                        <div>
                            <label>Password *</label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                style={inputStyle}
                            />
                        </div>

                        {/* Role */}

                        <div>
                            <label>ERP Role *</label>

                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="EMPLOYEE">
                                    EMPLOYEE
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="PROJECT_MANAGER">
                                    PROJECT_MANAGER
                                </option>

                                <option value="SALES_CRM">
                                    SALES_CRM
                                </option>

                                <option value="MARKETING">
                                    MARKETING
                                </option>

                                <option value="FINANCE">
                                    FINANCE
                                </option>

                                <option value="SUPER_ADMIN">
                                    SUPER_ADMIN
                                </option>
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Create Employee Account
                    </button>

                </form>

            </div>

            {/* Employee List */}

            <h3>Employees</h3>

            <div style={{ overflowX: "auto" }}>

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Joining Date</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {employees.map((employee) => (

                            <tr key={employee.id}>

                                <td>
                                    {employee.id}
                                </td>

                                <td>
                                    {employee.name}
                                </td>

                                <td>
                                    {employee.email}
                                </td>

                                <td>
                                    {employee.department}
                                </td>

                                <td>
                                    {employee.designation}
                                </td>

                                <td>
                                    {employee.joiningDate}
                                </td>

                                <td>
                                    {employee.username || "-"}
                                </td>

                                <td>
                                    {employee.role || "EMPLOYEE"}
                                </td>

                                <td>
                                    {employee.status}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            deleteEmployee(employee.id)
                                        }
                                        style={{
                                            padding: "6px 10px",
                                            color: "white",
                                            background: "#dc2626",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "5px"
};

export default Employees;