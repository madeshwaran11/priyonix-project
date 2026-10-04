import { useEffect, useState } from "react";
import api from "../services/api";

function ProjectTeam() {

    const [team, setTeam] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        projectId: "",
        employeeId: "",
        role: ""
    });

    useEffect(() => {
        loadTeam();
        loadProjects();
        loadEmployees();
    }, []);

    const loadTeam = async () => {
        try {
            const response = await api.get("/project-team");
            setTeam(response.data);
        } catch (error) {
            console.error("Error loading project team:", error);
        }
    };

    const loadProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error("Error loading employees:", error);
        }
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addTeamMember = async (event) => {

        event.preventDefault();

        if (!form.projectId || !form.employeeId) {
            alert("Please select project and employee");
            return;
        }

        const duplicate = team.some(
            (member) =>
                member.projectId === Number(form.projectId) &&
                member.employeeId === Number(form.employeeId)
        );

        if (duplicate) {
            alert("This employee is already assigned to this project.");
            return;
        }

        try {

            await api.post("/project-team", {
                projectId: Number(form.projectId),
                employeeId: Number(form.employeeId),
                role: form.role
            });

            alert("Team member added successfully!");

            setForm({
                projectId: "",
                employeeId: "",
                role: ""
            });

            loadTeam();

        } catch (error) {

            console.error("Error adding team member:", error);

            alert("Failed to add team member");
        }
    };

    const deleteTeamMember = async (id) => {

        if (!window.confirm("Remove this team member?")) {
            return;
        }

        try {

            await api.delete(`/project-team/${id}`);

            loadTeam();

        } catch (error) {

            console.error("Error deleting team member:", error);

            alert("Failed to remove team member");
        }
    };

    const getProjectName = (projectId) => {

        const project = projects.find(
            (project) => project.id === projectId
        );

        return project
            ? project.projectName
            : `Project ID: ${projectId}`;
    };

    const getEmployeeName = (employeeId) => {

        const employee = employees.find(
            (employee) => employee.id === employeeId
        );

        return employee
            ? employee.name
            : `Employee ID: ${employeeId}`;
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1100px",
                margin: "auto"
            }}
        >

            <h1>Project Team Management</h1>

            <p>
                Assign employees to projects and define
                their project roles.
            </p>

            <hr />

            <h2>Assign Team Member</h2>

            <form onSubmit={addTeamMember}>

                <div>
                    <label>Project</label>
                    <br />

                    <select
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Project
                        </option>

                        {projects.map((project) => (
                            <option
                                key={project.id}
                                value={project.id}
                            >
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Employee</label>
                    <br />

                    <select
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Employee
                        </option>

                        {employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.id}
                            >
                                {employee.name}
                                {employee.designation
                                    ? ` - ${employee.designation}`
                                    : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Project Role</label>
                    <br />

                    <input
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        placeholder="Example: Developer"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Add Team Member
                </button>

            </form>

            <hr />

            <h2>Project Team</h2>

            <p>
                Total Team Assignments: {team.length}
            </p>

            {team.length === 0 ? (
                <p>No team members assigned.</p>
            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    cellSpacing="0"
                    style={{ width: "100%" }}
                >

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Project</th>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {team.map((member) => (

                            <tr key={member.id}>

                                <td>
                                    {member.id}
                                </td>

                                <td>
                                    {getProjectName(
                                        member.projectId
                                    )}
                                </td>

                                <td>
                                    {getEmployeeName(
                                        member.employeeId
                                    )}
                                </td>

                                <td>
                                    {member.role}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            deleteTeamMember(
                                                member.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default ProjectTeam;