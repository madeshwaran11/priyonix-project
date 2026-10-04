import { useEffect, useState } from "react";
import api from "../services/api";

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);

    const [form, setForm] = useState({
        clientId: "",
        projectId: "",
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        amount: "",
        paidAmount: 0,
        description: ""
    });

    const loadInvoices = async () => {
        try {
            const response = await api.get("/invoices");
            setInvoices(response.data);
        } catch (error) {
            console.error("Error loading invoices:", error);
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

    const loadProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    useEffect(() => {
        loadInvoices();
        loadClients();
        loadProjects();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addInvoice = async (event) => {
        event.preventDefault();

        if (!form.clientId || !form.projectId) {
            alert("Please select client and project");
            return;
        }

        if (!form.invoiceNumber.trim()) {
            alert("Please enter invoice number");
            return;
        }

        if (!form.amount || Number(form.amount) <= 0) {
            alert("Invoice amount must be greater than 0");
            return;
        }

        if (
            form.invoiceDate &&
            form.dueDate &&
            form.dueDate < form.invoiceDate
        ) {
            alert("Due date cannot be before invoice date");
            return;
        }

        if (
            Number(form.paidAmount) < 0 ||
            Number(form.paidAmount) > Number(form.amount)
        ) {
            alert("Paid amount cannot be greater than invoice amount");
            return;
        }

        try {
            await api.post("/invoices", {
                ...form,
                clientId: Number(form.clientId),
                projectId: Number(form.projectId),
                amount: Number(form.amount),
                paidAmount: Number(form.paidAmount)
            });

            alert("Invoice created successfully!");

            setForm({
                clientId: "",
                projectId: "",
                invoiceNumber: "",
                invoiceDate: "",
                dueDate: "",
                amount: "",
                paidAmount: 0,
                description: ""
            });

            loadInvoices();

        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Failed to create invoice");
        }
    };

    const updatePayment = async (id, amount) => {
        const payment = window.prompt(
            `Enter payment amount (Maximum ₹${amount}):`,
            amount
        );

        if (payment === null) {
            return;
        }

        const paidAmount = Number(payment);

        if (isNaN(paidAmount) || paidAmount < 0) {
            alert("Enter a valid payment amount");
            return;
        }

        if (paidAmount > amount) {
            alert("Payment cannot be greater than invoice amount");
            return;
        }

        try {
            await api.put(
                `/invoices/${id}/payment?paidAmount=${paidAmount}`
            );

            alert("Payment updated successfully!");

            loadInvoices();

        } catch (error) {
            console.error("Error updating payment:", error);
            alert("Failed to update payment");
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

    const getProjectName = (projectId) => {
        const project = projects.find(
            (project) => project.id === projectId
        );

        return project
            ? project.projectName
            : `Project ID: ${projectId}`;
    };

    const isOverdue = (invoice) => {
        if (!invoice.dueDate) {
            return false;
        }

        if (invoice.paymentStatus === "PAID") {
            return false;
        }

        const today = new Date();
        const dueDate = new Date(invoice.dueDate);

        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    };

    const totalAmount = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount || 0),
        0
    );

    const totalPaid = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.paidAmount || 0),
        0
    );

    const totalOutstanding = invoices.reduce(
        (sum, invoice) =>
            sum +
            (
                Number(invoice.amount || 0) -
                Number(invoice.paidAmount || 0)
            ),
        0
    );

    const overdueInvoices = invoices.filter(
        (invoice) => isOverdue(invoice)
    ).length;

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >
            <h1>Finance & Invoice Management</h1>

            <hr />

            <h2>Finance Summary</h2>

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
                    <h3>Total Invoices</h3>
                    <p>{invoices.length}</p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Amount</h3>
                    <p>₹{totalAmount.toFixed(2)}</p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Paid</h3>
                    <p>₹{totalPaid.toFixed(2)}</p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Outstanding</h3>
                    <p>₹{totalOutstanding.toFixed(2)}</p>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Overdue</h3>
                    <p>{overdueInvoices}</p>
                </div>
            </div>

            <hr />

            <h2>Create Invoice</h2>

            <form onSubmit={addInvoice}>
                <select
                    name="clientId"
                    value={form.clientId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Client</option>

                    {clients.map((client) => (
                        <option
                            key={client.id}
                            value={client.id}
                        >
                            {client.companyName}
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Project</option>

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
                    name="invoiceNumber"
                    placeholder="Invoice Number"
                    value={form.invoiceNumber}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>Invoice Date</label>

                <br />

                <input
                    name="invoiceDate"
                    type="date"
                    value={form.invoiceDate}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <label>Due Date</label>

                <br />

                <input
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    min={form.invoiceDate}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="Invoice Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="paidAmount"
                    type="number"
                    min="0"
                    placeholder="Paid Amount"
                    value={form.paidAmount}
                    onChange={handleChange}
                />

                <br />
                <br />

                <textarea
                    name="description"
                    placeholder="Invoice Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Create Invoice
                </button>
            </form>

            <hr />

            <h2>Invoice List</h2>

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
                        <th>Invoice</th>
                        <th>Client</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Outstanding</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {invoices.map((invoice) => {
                        const amount =
                            Number(invoice.amount || 0);

                        const paidAmount =
                            Number(invoice.paidAmount || 0);

                        const outstanding =
                            amount - paidAmount;

                        const overdue =
                            isOverdue(invoice);

                        return (
                            <tr key={invoice.id}>
                                <td>
                                    {invoice.invoiceNumber}
                                </td>

                                <td>
                                    {getClientName(
                                        invoice.clientId
                                    )}
                                </td>

                                <td>
                                    {getProjectName(
                                        invoice.projectId
                                    )}
                                </td>

                                <td>
                                    ₹{amount.toFixed(2)}
                                </td>

                                <td>
                                    ₹{paidAmount.toFixed(2)}
                                </td>

                                <td>
                                    ₹{outstanding.toFixed(2)}
                                </td>

                                <td>
                                    {invoice.dueDate}
                                </td>

                                <td>
                                    {overdue
                                        ? "OVERDUE"
                                        : invoice.paymentStatus}
                                </td>

                                <td>
                                    {invoice.paymentStatus !==
                                        "PAID" && (
                                        <button
                                            onClick={() =>
                                                updatePayment(
                                                    invoice.id,
                                                    outstanding
                                                )
                                            }
                                        >
                                            Update Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Invoices;