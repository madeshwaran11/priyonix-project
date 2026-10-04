import { useEffect, useState } from "react";
import api from "../services/api";

function Role() {
    const [roles, setRoles] = useState([]);

    const [form, setForm] = useState({
        roleName: "",
        description: ""
    });

    const defaultRoles = [
        {
            roleName: "SUPER_ADMIN",
            description: "Full access to all ERP modules"
        },
        {
            roleName: "HR",
            description: "Employee, attendance and leave management"
        },
        {
            roleName: "PROJECT_MANAGER",
            description: "Project, team, milestone and task management"
        },
        {
            roleName: "EMPLOYEE",
            description: "Employee tasks, attendance and leave requests"
        },
        {
            roleName: "SALES_CRM",
            description: "Lead, client and sales management"
        },
        {
            roleName: "MARKETING",
            description: "Campaign and digital marketing management"
        },
        {
            roleName: "FINANCE",
            description: "Invoice, payment and expense management"
        }
    ];

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const response = await api.get("/roles");
            setRoles(response.data);
        } catch (error) {
            console.error("Error loading roles:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addRole = async (e) => {
        e.preventDefault();

        if (!form.roleName.trim()) {
            alert("Role name is required");
            return;
        }

        try {
            await api.post("/roles", {
                roleName: form.roleName.trim(),
                description: form.description.trim()
            });

            alert("Role added successfully!");

            setForm({
                roleName: "",
                description: ""
            });

            loadRoles();

        } catch (error) {
            console.error("Error adding role:", error);
            alert("Failed to add role");
        }
    };

    const addDefaultRoles = async () => {
        try {
            for (const role of defaultRoles) {
                const exists = roles.some(
                    (existingRole) =>
                        existingRole.roleName === role.roleName
                );

                if (!exists) {
                    await api.post("/roles", role);
                }
            }

            alert("Default ERP roles added successfully!");

            loadRoles();

        } catch (error) {
            console.error(
                "Error adding default roles:",
                error
            );

            alert("Failed to add default roles");
        }
    };

    const deleteRole = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this role?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/roles/${id}`);

            alert("Role deleted successfully!");

            loadRoles();

        } catch (error) {
            console.error(
                "Error deleting role:",
                error
            );

            alert("Failed to delete role");
        }
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >
            <h1>Roles Management</h1>

            <p>
                ERP role definitions for different departments
                and responsibilities.
            </p>

            <hr />

            <h2>Add Role</h2>

            <form onSubmit={addRole}>
                <input
                    type="text"
                    name="roleName"
                    placeholder="Role Name"
                    value={form.roleName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Add Role
                </button>

                {" "}

                <button
                    type="button"
                    onClick={addDefaultRoles}
                >
                    Add Default ERP Roles
                </button>
            </form>

            <hr />

            <h2>ERP Roles</h2>

            <p>
                Total Roles: {roles.length}
            </p>

            {roles.length === 0 ? (
                <p>No roles found.</p>
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
                            <th>Role Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td>
                                    {role.id}
                                </td>

                                <td>
                                    <strong>
                                        {role.roleName}
                                    </strong>
                                </td>

                                <td>
                                    {role.description}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            deleteRole(
                                                role.id
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

export default Role;