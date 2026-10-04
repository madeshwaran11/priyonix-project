import { useEffect, useState } from "react";
import api from "../services/api";

function Clients() {
    const [clients, setClients] = useState([]);

    const [form, setForm] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        address: ""
    });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const response = await api.get("/clients");
            setClients(response.data);
        } catch (error) {
            console.error("Error loading clients:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addClient = async (e) => {
        e.preventDefault();

        if (!form.companyName.trim()) {
            alert("Please enter company name");
            return;
        }

        if (!form.contactName.trim()) {
            alert("Please enter contact name");
            return;
        }

        try {
            await api.post("/clients", {
                ...form
            });

            alert("Client added successfully!");

            setForm({
                companyName: "",
                contactName: "",
                email: "",
                phone: "",
                industry: "",
                address: ""
            });

            loadClients();

        } catch (error) {
            console.error("Error adding client:", error);
            alert("Failed to add client");
        }
    };

    const deleteClient = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this client?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/clients/${id}`);

            alert("Client deleted successfully!");

            loadClients();

        } catch (error) {
            console.error(
                "Error deleting client:",
                error
            );

            alert(
                "Unable to delete client. It may be linked to projects or invoices."
            );
        }
    };

    const activeClients = clients.filter(
        (client) => client.status === "ACTIVE"
    ).length;

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >
            <h1>Client Management</h1>

            <p>
                CRM Lead Conversion → Client → Project
            </p>

            <hr />

            <h2>Client Summary</h2>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "30px"
                }}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        minWidth: "180px",
                        textAlign: "center"
                    }}
                >
                    <h3>Total Clients</h3>

                    <h2>{clients.length}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        minWidth: "180px",
                        textAlign: "center"
                    }}
                >
                    <h3>Active Clients</h3>

                    <h2>{activeClients}</h2>
                </div>
            </div>

            <hr />

            <h2>Add Client</h2>

            <form onSubmit={addClient}>

                <input
                    name="companyName"
                    placeholder="Company Name"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="contactName"
                    placeholder="Contact Name"
                    value={form.contactName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="industry"
                    placeholder="Industry"
                    value={form.industry}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Add Client
                </button>

            </form>

            <hr />

            <h2>Client List</h2>

            {clients.length === 0 ? (
                <p>No clients found.</p>
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
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Industry</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>

                                <td>
                                    {client.id}
                                </td>

                                <td>
                                    {client.companyName}
                                </td>

                                <td>
                                    {client.contactName}
                                </td>

                                <td>
                                    {client.email}
                                </td>

                                <td>
                                    {client.phone}
                                </td>

                                <td>
                                    {client.industry}
                                </td>

                                <td>
                                    {client.address}
                                </td>

                                <td>
                                    {client.status}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            deleteClient(
                                                client.id
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

export default Clients;