import { useEffect, useState } from "react";
import api from "../services/api";

function Milestones() {
    const [milestones, setMilestones] = useState([]);
    const [projects, setProjects] = useState([]);

    const [projectId, setProjectId] = useState("");
    const [milestoneName, setMilestoneName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    const loadMilestones = async () => {
        try {
            const response = await api.get("/milestones");
            setMilestones(response.data);
        } catch (error) {
            console.error("Error loading milestones:", error);
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

    useEffect(() => {
        loadMilestones();
        loadProjects();
    }, []);

    const addMilestone = async (event) => {
        event.preventDefault();

        if (
            !projectId ||
            !milestoneName ||
            !startDate ||
            !dueDate
        ) {
            alert("Please fill all required fields");
            return;
        }

        if (dueDate < startDate) {
            alert("Due date cannot be before start date");
            return;
        }

        try {
            await api.post("/milestones", {
                projectId: Number(projectId),
                milestoneName,
                description,
                startDate,
                dueDate
            });

            alert("Milestone added successfully!");

            setProjectId("");
            setMilestoneName("");
            setDescription("");
            setStartDate("");
            setDueDate("");

            loadMilestones();

        } catch (error) {
            console.error("Error creating milestone:", error);
            alert("Failed to create milestone");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/milestones/${id}/status?status=${status}`
            );

            loadMilestones();

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update milestone status");
        }
    };

    const updateProgress = async (id, progress) => {
        try {
            await api.put(
                `/milestones/${id}/progress?progress=${progress}`
            );

            loadMilestones();

        } catch (error) {
            console.error("Error updating progress:", error);
            alert("Failed to update milestone progress");
        }
    };

    const deleteMilestone = async (id) => {

        if (!window.confirm("Delete this milestone?")) {
            return;
        }

        try {
            await api.delete(`/milestones/${id}`);

            alert("Milestone deleted successfully!");

            loadMilestones();

        } catch (error) {
            console.error("Error deleting milestone:", error);
            alert("Failed to delete milestone");
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

    const getProgressLabel = (progress) => {

        if (progress === 100) {
            return "Completed";
        }

        if (progress > 0) {
            return "In Progress";
        }

        return "Not Started";
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >

            <h1>Project Milestones</h1>

            <p>
                Manage project milestones, deadlines,
                status and progress.
            </p>

            <hr />

            <h2>Create Milestone</h2>

            <form onSubmit={addMilestone}>

                <div>
                    <label>Project</label>
                    <br />

                    <select
                        value={projectId}
                        onChange={(e) =>
                            setProjectId(e.target.value)
                        }
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
                    <label>Milestone Name</label>
                    <br />

                    <input
                        type="text"
                        placeholder="Example: Employee Module"
                        value={milestoneName}
                        onChange={(e) =>
                            setMilestoneName(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        placeholder="Milestone description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows="4"
                    />
                </div>

                <br />

                <div>
                    <label>Start Date</label>
                    <br />

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Due Date</label>
                    <br />

                    <input
                        type="date"
                        value={dueDate}
                        min={startDate}
                        onChange={(e) =>
                            setDueDate(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Add Milestone
                </button>

            </form>

            <hr />

            <h2>Milestone List</h2>

            <p>
                Total Milestones: {milestones.length}
            </p>

            {milestones.length === 0 ? (
                <p>No milestones found.</p>
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
                            <th>Milestone</th>
                            <th>Start Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {milestones.map((milestone) => (

                            <tr key={milestone.id}>

                                <td>
                                    {milestone.id}
                                </td>

                                <td>
                                    {getProjectName(
                                        milestone.projectId
                                    )}
                                </td>

                                <td>
                                    <strong>
                                        {milestone.milestoneName}
                                    </strong>

                                    <br />

                                    <small>
                                        {milestone.description}
                                    </small>
                                </td>

                                <td>
                                    {milestone.startDate}
                                </td>

                                <td>
                                    {milestone.dueDate}
                                </td>

                                <td>
                                    {milestone.status}
                                </td>

                                <td>
                                    {milestone.progress}%
                                    <br />
                                    <small>
                                        {getProgressLabel(
                                            milestone.progress
                                        )}
                                    </small>
                                </td>

                                <td>

                                    {milestone.status !== "IN_PROGRESS" &&
                                        milestone.status !== "COMPLETED" && (

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        milestone.id,
                                                        "IN_PROGRESS"
                                                    )
                                                }
                                            >
                                                Start
                                            </button>

                                        )}

                                    {" "}

                                    <button
                                        onClick={() =>
                                            updateProgress(
                                                milestone.id,
                                                50
                                            )
                                        }
                                    >
                                        50%
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            updateProgress(
                                                milestone.id,
                                                100
                                            )
                                        }
                                    >
                                        100%
                                    </button>

                                    {" "}

                                    {milestone.status !== "COMPLETED" && (

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    milestone.id,
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
                                            deleteMilestone(
                                                milestone.id
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

export default Milestones;