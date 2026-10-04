import { useEffect, useState } from "react";
import api from "../services/api";

function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [projects, setProjects] = useState([]);

    const [form, setForm] = useState({
        projectId: "",
        expenseDate: "",
        category: "",
        description: "",
        amount: "",
        status: "PENDING"
    });

    useEffect(() => {
        loadExpenses();
        loadProjects();
    }, []);

    const loadExpenses = async () => {
        try {
            const response = await api.get("/expenses");
            setExpenses(response.data);
        } catch (error) {
            console.error("Error loading expenses:", error);
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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addExpense = async (e) => {
        e.preventDefault();

        if (!form.projectId) {
            alert("Please select a project");
            return;
        }

        if (!form.expenseDate) {
            alert("Please select expense date");
            return;
        }

        if (!form.category.trim()) {
            alert("Please enter expense category");
            return;
        }

        if (!form.amount || Number(form.amount) <= 0) {
            alert("Expense amount must be greater than 0");
            return;
        }

        try {
            await api.post("/expenses", {
                ...form,
                projectId: Number(form.projectId),
                amount: Number(form.amount)
            });

            alert("Expense added successfully!");

            setForm({
                projectId: "",
                expenseDate: "",
                category: "",
                description: "",
                amount: "",
                status: "PENDING"
            });

            loadExpenses();

        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add expense");
        }
    };

    const deleteExpense = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/expenses/${id}`);

            alert("Expense deleted successfully!");

            loadExpenses();

        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("Failed to delete expense");
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

    const totalExpenseAmount = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount || 0),
        0
    );

    const approvedAmount = expenses
        .filter((expense) => expense.status === "APPROVED")
        .reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );

    const pendingAmount = expenses
        .filter((expense) => expense.status === "PENDING")
        .reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );

    const rejectedAmount = expenses
        .filter((expense) => expense.status === "REJECTED")
        .reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >
            <h1>Expense Management</h1>

            <hr />

            <h2>Expense Summary</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "30px"
                }}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Expenses</h3>
                    <p>{expenses.length}</p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Amount</h3>
                    <p>
                        ₹{totalExpenseAmount.toFixed(2)}
                    </p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Approved</h3>
                    <p>
                        ₹{approvedAmount.toFixed(2)}
                    </p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Pending</h3>
                    <p>
                        ₹{pendingAmount.toFixed(2)}
                    </p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Rejected</h3>
                    <p>
                        ₹{rejectedAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <hr />

            <h2>Add Expense</h2>

            <form onSubmit={addExpense}>

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

                <br />
                <br />

                <input
                    name="expenseDate"
                    type="date"
                    value={form.expenseDate}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="PENDING">
                        PENDING
                    </option>

                    <option value="APPROVED">
                        APPROVED
                    </option>

                    <option value="REJECTED">
                        REJECTED
                    </option>
                </select>

                <br />
                <br />

                <button type="submit">
                    Add Expense
                </button>

            </form>

            <hr />

            <h2>Expense List</h2>

            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
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
                            <th>Project</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>

                                <td>
                                    {expense.id}
                                </td>

                                <td>
                                    {getProjectName(
                                        expense.projectId
                                    )}
                                </td>

                                <td>
                                    {expense.expenseDate}
                                </td>

                                <td>
                                    {expense.category}
                                </td>

                                <td>
                                    {expense.description}
                                </td>

                                <td>
                                    ₹
                                    {Number(
                                        expense.amount || 0
                                    ).toFixed(2)}
                                </td>

                                <td>
                                    {expense.status}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            deleteExpense(
                                                expense.id
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

export default Expense;