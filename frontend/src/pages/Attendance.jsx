import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        employeeId: "",
        date: "",
        checkIn: "",
        checkOut: "",
        status: "PRESENT"
    });

    useEffect(() => {
        loadAttendance();
        loadEmployees();
    }, []);

    const loadAttendance = async () => {
        try {
            const response = await api.get("/attendance");
            setAttendance(response.data);
        } catch (error) {
            console.error("Error loading attendance:", error);
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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addAttendance = async (e) => {
        e.preventDefault();

        try {
            await api.post("/attendance", {
                ...form,
                employeeId: Number(form.employeeId)
            });

            alert("Attendance added successfully!");

            setForm({
                employeeId: "",
                date: "",
                checkIn: "",
                checkOut: "",
                status: "PRESENT"
            });

            loadAttendance();

        } catch (error) {
            console.error("Error adding attendance:", error);
            alert("Failed to add attendance");
        }
    };

    const deleteAttendance = async (id) => {
        try {
            await api.delete(`/attendance/${id}`);
            loadAttendance();
        } catch (error) {
            console.error("Error deleting attendance:", error);
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(
            (employee) => employee.id === employeeId
        );

        return employee
            ? employee.name
            : `Employee ID: ${employeeId}`;
    };

    const calculateWorkingHours = (checkIn, checkOut) => {

        if (!checkIn || !checkOut) {
            return "-";
        }

        const [inHour, inMinute] = checkIn
            .split(":")
            .map(Number);

        const [outHour, outMinute] = checkOut
            .split(":")
            .map(Number);

        const startMinutes =
            inHour * 60 + inMinute;

        const endMinutes =
            outHour * 60 + outMinute;

        const difference =
            endMinutes - startMinutes;

        if (difference <= 0) {
            return "-";
        }

        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;

        return `${hours}h ${minutes}m`;
    };

    const getStatusCount = (status) => {
        return attendance.filter(
            (record) => record.status === status
        ).length;
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >

            <h1>Attendance Management</h1>

            <hr />

            <h2>Attendance Summary</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "20px"
                }}
            >

                <div>
                    <strong>Total Records</strong>
                    <br />
                    {attendance.length}
                </div>

                <div>
                    <strong>Present</strong>
                    <br />
                    {getStatusCount("PRESENT")}
                </div>

                <div>
                    <strong>Absent</strong>
                    <br />
                    {getStatusCount("ABSENT")}
                </div>

                <div>
                    <strong>Half Day</strong>
                    <br />
                    {getStatusCount("HALF_DAY")}
                </div>

                <div>
                    <strong>Leave</strong>
                    <br />
                    {getStatusCount("LEAVE")}
                </div>

            </div>

            <hr />

            <h2>Mark Attendance</h2>

            <form onSubmit={addAttendance}>

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
                        </option>
                    ))}
                </select>

                {" "}

                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />

                {" "}

                <input
                    name="checkIn"
                    type="time"
                    value={form.checkIn}
                    onChange={handleChange}
                />

                {" "}

                <input
                    name="checkOut"
                    type="time"
                    value={form.checkOut}
                    onChange={handleChange}
                />

                {" "}

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="PRESENT">
                        PRESENT
                    </option>

                    <option value="ABSENT">
                        ABSENT
                    </option>

                    <option value="HALF_DAY">
                        HALF DAY
                    </option>

                    <option value="LEAVE">
                        LEAVE
                    </option>
                </select>

                {" "}

                <button type="submit">
                    Add Attendance
                </button>

            </form>

            <hr />

            <h2>Attendance Records</h2>

            {attendance.length === 0 ? (
                <p>No attendance records found.</p>
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
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map((record) => (

                            <tr key={record.id}>

                                <td>
                                    {record.id}
                                </td>

                                <td>
                                    {getEmployeeName(
                                        record.employeeId
                                    )}
                                </td>

                                <td>
                                    {record.date}
                                </td>

                                <td>
                                    {record.checkIn || "-"}
                                </td>

                                <td>
                                    {record.checkOut || "-"}
                                </td>

                                <td>
                                    {calculateWorkingHours(
                                        record.checkIn,
                                        record.checkOut
                                    )}
                                </td>

                                <td>
                                    {record.status}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            deleteAttendance(
                                                record.id
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

export default Attendance;