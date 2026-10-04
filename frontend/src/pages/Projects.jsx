import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        clientId: "",
        projectName: "",
        projectManager: "",
        startDate: "",
        endDate: "",
        status: "PLANNED",
        priority: "MEDIUM",
        description: ""
    });

    const loadProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    const loadClients = async () => {
        try {
            const response = await api.get("/clients");
            setClients(response.data);
        } catch (error) {
            console.error("Error loading clients:", error);
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

    useEffect(() => {
        loadProjects();
        loadClients();
        loadEmployees();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addProject = async (event) => {
        event.preventDefault();

        if (!form.clientId) {
            alert("Please select a client");
            return;
        }

        try {
            await api.post("/projects", {
                ...form,
                clientId: Number(form.clientId)
            });

            alert("Project added successfully!");

            setForm({
                clientId: "",
                projectName: "",
                projectManager: "",
                startDate: "",
                endDate: "",
                status: "PLANNED",
                priority: "MEDIUM",
                description: ""
            });

            loadProjects();

        } catch (error) {
            console.error("Error adding project:", error);
            alert("Failed to add project");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/projects/${id}/status?status=${status}`
            );

            loadProjects();

        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const deleteProject = async (id) => {

        if (!window.confirm("Delete this project?")) {
            return;
        }

        try {

            await api.delete(`/projects/${id}`);

            alert("Project deleted successfully!");

            loadProjects();

        } catch (error) {

            console.error("Error deleting project:", error);

            alert(
                "Unable to delete project. It may already have related tasks or invoices."
            );
        }
    };

    const getClientName = (clientId) => {
        const client = clients.find(
            (client) => client.id === clientId
        );

        return client
            ? client.companyName
            : `Client ID: ${clientId}`;
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >

            <h1>Project Management</h1>

            <p>
                Manage clients, projects, project managers,
                timelines, priorities and project status.
            </p>

            <hr />

            <h2>Create Project</h2>

            <form onSubmit={addProject}>

                <div>
                    <label>Client</label>
                    <br />

                    <select
                        name="clientId"
                        value={form.clientId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Client
                        </option>

                        {clients.map((client) => (
                            <option
                                key={client.id}
                                value={client.id}
                            >
                                {client.companyName}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Project Name</label>
                    <br />

                    <input
                        name="projectName"
                        placeholder="Project Name"
                        value={form.projectName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Project Manager</label>
                    <br />

                    <select
                        name="projectManager"
                        value={form.projectManager}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select Project Manager
                        </option>

                        {employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.name}
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
                    <label>Start Date</label>
                    <br />

                    <input
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>End Date</label>
                    <br />

                    <input
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Status</label>
                    <br />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="PLANNED">
                            PLANNED
                        </option>

                        <option value="IN_PROGRESS">
                            IN PROGRESS
                        </option>

                        <option value="COMPLETED">
                            COMPLETED
                        </option>

                        <option value="ON_HOLD">
                            ON HOLD
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Priority</label>
                    <br />

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <option value="LOW">
                            LOW
                        </option>

                        <option value="MEDIUM">
                            MEDIUM
                        </option>

                        <option value="HIGH">
                            HIGH
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        name="description"
                        placeholder="Project Description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <br />

                <button type="submit">
                    Create Project
                </button>

            </form>

            <hr />

            <h2>Project List</h2>

            <p>
                Total Projects: {projects.length}
            </p>

            {projects.length === 0 ? (
                <p>No projects found.</p>
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
                            <th>Client</th>
                            <th>Project</th>
                            <th>Manager</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {projects.map((project) => (

                            <tr key={project.id}>

                                <td>
                                    {project.id}
                                </td>

                                <td>
                                    {getClientName(
                                        project.clientId
                                    )}
                                </td>

                                <td>
                                    {project.projectName}
                                </td>

                                <td>
                                    {project.projectManager}
                                </td>

                                <td>
                                    {project.startDate}
                                </td>

                                <td>
                                    {project.endDate}
                                </td>

                                <td>
                                    {project.status}
                                </td>

                                <td>
                                    {project.priority}
                                </td>

                                <td>

                                    {project.status !== "IN_PROGRESS" &&
                                        project.status !== "COMPLETED" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        project.id,
                                                        "IN_PROGRESS"
                                                    )
                                                }
                                            >
                                                Start
                                            </button>
                                        )}

                                    {" "}

                                    {project.status !== "COMPLETED" && (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    project.id,
                                                    "COMPLETED"
                                                )
                                            }
                                        >
                                            Complete
                                        </button>
                                    )}

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deleteProject(
                                                project.id
                                            )
                                        }
                                    >
                                        Delete
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

export default Projects;