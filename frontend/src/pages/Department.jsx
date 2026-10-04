import { useEffect, useState } from "react";
import api from "../services/api";

function Department() {
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({
        departmentName: "",
        description: ""
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await api.get("/departments");
            setDepartments(response.data);
        } catch (error) {
            console.error("Error loading departments:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addDepartment = async (e) => {
        e.preventDefault();

        try {
            await api.post("/departments", form);

            setForm({
                departmentName: "",
                description: ""
            });

            loadDepartments();

        } catch (error) {
            console.error("Error adding department:", error);
        }
    };

    const deleteDepartment = async (id) => {
        try {
            await api.delete(`/departments/${id}`);
            loadDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    return (
        <div>
            <h2>Department Management</h2>

            <form onSubmit={addDepartment}>

                <input
                    name="departmentName"
                    placeholder="Department Name"
                    value={form.departmentName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <button type="submit">
                    Add Department
                </button>

            </form>

            <hr />

            <h3>Departments</h3>

            {departments.length === 0 ? (
                <p>No departments found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.id}>
                                <td>{department.id}</td>
                                <td>{department.departmentName}</td>
                                <td>{department.description}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            deleteDepartment(department.id)
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

export default Department;