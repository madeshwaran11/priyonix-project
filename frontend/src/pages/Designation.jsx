import { useEffect, useState } from "react";
import api from "../services/api";

function Designation() {
    const [designations, setDesignations] = useState([]);

    const [form, setForm] = useState({
        designationName: "",
        description: ""
    });

    useEffect(() => {
        loadDesignations();
    }, []);

    const loadDesignations = async () => {
        try {
            const response = await api.get("/designations");
            setDesignations(response.data);
        } catch (error) {
            console.error("Error loading designations:", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addDesignation = async (e) => {
        e.preventDefault();

        try {
            await api.post("/designations", form);

            setForm({
                designationName: "",
                description: ""
            });

            loadDesignations();

        } catch (error) {
            console.error("Error adding designation:", error);
        }
    };

    const deleteDesignation = async (id) => {
        try {
            await api.delete(`/designations/${id}`);
            loadDesignations();
        } catch (error) {
            console.error("Error deleting designation:", error);
        }
    };

    return (
        <div>
            <h2>Designation Management</h2>

            <form onSubmit={addDesignation}>

                <input
                    name="designationName"
                    placeholder="Designation Name"
                    value={form.designationName}
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
                    Add Designation
                </button>

            </form>

            <hr />

            <h3>Designations</h3>

            {designations.length === 0 ? (
                <p>No designations found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Designation</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {designations.map((designation) => (
                            <tr key={designation.id}>
                                <td>{designation.id}</td>
                                <td>{designation.designationName}</td>
                                <td>{designation.description}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            deleteDesignation(designation.id)
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

export default Designation;