import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        projectId: "",
        employeeId: "",
        taskName: "",
        description: "",
        startDate: "",
        dueDate: "",
        status: "TODO",
        priority: "MEDIUM",
        progress: 0
    });

    const [subtaskForm, setSubtaskForm] = useState({
        taskId: "",
        subtaskName: "",
        description: "",
        dueDate: ""
    });

    useEffect(() => {
        loadTasks();
        loadSubtasks();
        loadProjects();
        loadEmployees();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await api.get("/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const loadSubtasks = async () => {
        try {
            const response = await api.get("/subtasks");
            setSubtasks(response.data);
        } catch (error) {
            console.error("Error loading subtasks:", error);
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

    const handleSubtaskChange = (event) => {
        setSubtaskForm({
            ...subtaskForm,
            [event.target.name]: event.target.value
        });
    };

    const addTask = async (event) => {

        event.preventDefault();

        if (!form.projectId || !form.employeeId) {
            alert("Please select project and employee");
            return;
        }

        if (form.startDate && form.dueDate) {
            if (form.dueDate < form.startDate) {
                alert("Due date cannot be before start date");
                return;
            }
        }

        try {

            await api.post("/tasks", {
                ...form,
                projectId: Number(form.projectId),
                employeeId: Number(form.employeeId),
                progress: Number(form.progress)
            });

            alert("Task added successfully!");

            setForm({
                projectId: "",
                employeeId: "",
                taskName: "",
                description: "",
                startDate: "",
                dueDate: "",
                status: "TODO",
                priority: "MEDIUM",
                progress: 0
            });

            loadTasks();

        } catch (error) {

            console.error("Error adding task:", error);
            alert("Failed to add task");
        }
    };

    const addSubtask = async (event) => {

        event.preventDefault();

        if (!subtaskForm.taskId || !subtaskForm.subtaskName) {
            alert("Please select a task and enter subtask name");
            return;
        }

        try {

            await api.post("/subtasks", {
                ...subtaskForm,
                taskId: Number(subtaskForm.taskId)
            });

            alert("Subtask added successfully!");

            setSubtaskForm({
                taskId: "",
                subtaskName: "",
                description: "",
                dueDate: ""
            });

            loadSubtasks();

        } catch (error) {

            console.error("Error adding subtask:", error);
            alert("Failed to add subtask");
        }
    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(
                `/tasks/${id}/status?status=${status}`
            );

            loadTasks();

        } catch (error) {

            console.error("Error updating task:", error);
            alert("Failed to update task");
        }
    };

    const updateProgress = async (id, progress) => {

        try {

            await api.put(
                `/tasks/${id}/progress?progress=${progress}`
            );

            loadTasks();

        } catch (error) {

            console.error("Error updating progress:", error);
            alert("Failed to update progress");
        }
    };

    const deleteTask = async (id) => {

        if (!window.confirm("Delete this task?")) {
            return;
        }

        try {

            await api.delete(`/tasks/${id}`);

            alert("Task deleted successfully!");

            loadTasks();
            loadSubtasks();

        } catch (error) {

            console.error("Error deleting task:", error);

            alert(
                "Unable to delete task. It may have related subtasks."
            );
        }
    };

    const updateSubtaskStatus = async (id, status) => {

        try {

            await api.put(
                `/subtasks/${id}/status?status=${status}`
            );

            loadSubtasks();

        } catch (error) {

            console.error("Error updating subtask:", error);
        }
    };

    const updateSubtaskProgress = async (id, progress) => {

        try {

            await api.put(
                `/subtasks/${id}/progress?progress=${progress}`
            );

            loadSubtasks();

        } catch (error) {

            console.error(
                "Error updating subtask progress:",
                error
            );
        }
    };

    const deleteSubtask = async (id) => {

        if (!window.confirm("Delete this subtask?")) {
            return;
        }

        try {

            await api.delete(`/subtasks/${id}`);

            loadSubtasks();

        } catch (error) {

            console.error(
                "Error deleting subtask:",
                error
            );
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

    const getTaskName = (taskId) => {

        const task = tasks.find(
            (task) => task.id === taskId
        );

        return task
            ? task.taskName
            : `Task ID: ${taskId}`;
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >

            <h1>Task Management</h1>

            <p>
                Manage project tasks, employees,
                deadlines and task progress.
            </p>

            <hr />

            <h2>Create Task</h2>

            <form onSubmit={addTask}>

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
                    <label>Assigned Employee</label>
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
                    <label>Task Name</label>
                    <br />

                    <input
                        name="taskName"
                        placeholder="Task Name"
                        value={form.taskName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        name="description"
                        placeholder="Task Description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                    />
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
                    />
                </div>

                <br />

                <div>
                    <label>Due Date</label>
                    <br />

                    <input
                        name="dueDate"
                        type="date"
                        min={form.startDate}
                        value={form.dueDate}
                        onChange={handleChange}
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
                        <option value="TODO">
                            TODO
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
                    <label>Initial Progress %</label>
                    <br />

                    <input
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={form.progress}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Create Task
                </button>

            </form>

            <hr />

            <h2>Task List</h2>

            <p>
                Total Tasks: {tasks.length}
            </p>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    cellSpacing="0"
                    style={{ width: "100%" }}
                >

                    <thead>

                        <tr>
                            <th>Project</th>
                            <th>Employee</th>
                            <th>Task</th>
                            <th>Start Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {tasks.map((task) => (

                            <tr key={task.id}>

                                <td>
                                    {getProjectName(
                                        task.projectId
                                    )}
                                </td>

                                <td>
                                    {getEmployeeName(
                                        task.employeeId
                                    )}
                                </td>

                                <td>
                                    <strong>
                                        {task.taskName}
                                    </strong>

                                    <br />

                                    <small>
                                        {task.description}
                                    </small>
                                </td>

                                <td>
                                    {task.startDate || "-"}
                                </td>

                                <td>
                                    {task.dueDate || "-"}
                                </td>

                                <td>
                                    {task.status}
                                </td>

                                <td>
                                    {task.priority}
                                </td>

                                <td>
                                    {task.progress}%
                                </td>

                                <td>

                                    {task.status !== "IN_PROGRESS" &&
                                        task.status !== "COMPLETED" && (

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        task.id,
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
                                                task.id,
                                                50
                                            )
                                        }
                                    >
                                        50%
                                    </button>

                                    {" "}

                                    {task.status !== "COMPLETED" && (

                                        <button
                                            onClick={() => {
                                                updateProgress(
                                                    task.id,
                                                    100
                                                );
                                                updateStatus(
                                                    task.id,
                                                    "COMPLETED"
                                                );
                                            }}
                                        >
                                            Complete
                                        </button>
                                    )}

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deleteTask(
                                                task.id
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

            <hr />

            <h2>Create Subtask</h2>

            <form onSubmit={addSubtask}>

                <div>
                    <label>Task</label>
                    <br />

                    <select
                        name="taskId"
                        value={subtaskForm.taskId}
                        onChange={handleSubtaskChange}
                        required
                    >
                        <option value="">
                            Select Task
                        </option>

                        {tasks.map((task) => (
                            <option
                                key={task.id}
                                value={task.id}
                            >
                                {task.taskName}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Subtask Name</label>
                    <br />

                    <input
                        name="subtaskName"
                        placeholder="Subtask Name"
                        value={subtaskForm.subtaskName}
                        onChange={handleSubtaskChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        name="description"
                        placeholder="Subtask Description"
                        value={subtaskForm.description}
                        onChange={handleSubtaskChange}
                        rows="3"
                    />
                </div>

                <br />

                <div>
                    <label>Due Date</label>
                    <br />

                    <input
                        name="dueDate"
                        type="date"
                        value={subtaskForm.dueDate}
                        onChange={handleSubtaskChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Create Subtask
                </button>

            </form>

            <hr />

            <h2>Subtask List</h2>

            <p>
                Total Subtasks: {subtasks.length}
            </p>

            {subtasks.length === 0 ? (
                <p>No subtasks found.</p>
            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    cellSpacing="0"
                    style={{ width: "100%" }}
                >

                    <thead>

                        <tr>
                            <th>Task</th>
                            <th>Subtask</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {subtasks.map((subtask) => (

                            <tr key={subtask.id}>

                                <td>
                                    {getTaskName(
                                        subtask.taskId
                                    )}
                                </td>

                                <td>
                                    {subtask.subtaskName}
                                </td>

                                <td>
                                    {subtask.description}
                                </td>

                                <td>
                                    {subtask.dueDate || "-"}
                                </td>

                                <td>
                                    {subtask.status}
                                </td>

                                <td>
                                    {subtask.progress}%
                                </td>

                                <td>

                                    {subtask.status !== "IN_PROGRESS" &&
                                        subtask.status !== "COMPLETED" && (

                                            <button
                                                onClick={() =>
                                                    updateSubtaskStatus(
                                                        subtask.id,
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
                                            updateSubtaskProgress(
                                                subtask.id,
                                                50
                                            )
                                        }
                                    >
                                        50%
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() => {
                                            updateSubtaskProgress(
                                                subtask.id,
                                                100
                                            );
                                            updateSubtaskStatus(
                                                subtask.id,
                                                "COMPLETED"
                                            );
                                        }}
                                    >
                                        Complete
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deleteSubtask(
                                                subtask.id
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

export default Tasks;