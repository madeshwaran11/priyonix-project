import { useEffect, useState } from "react";
import api from "../services/api";

function Leave() {

    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        employeeId: "",
        leaveType: "CASUAL",
        fromDate: "",
        toDate: "",
        reason: ""
    });

    const loadLeaves = async () => {
        try {
            const response = await api.get("/leaves");
            setLeaves(response.data);
        } catch (error) {
            console.error("Error loading leaves:", error);
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
        loadLeaves();
        loadEmployees();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitLeave = async (event) => {

        event.preventDefault();

        try {

            await api.post("/leaves", {
                employeeId: Number(form.employeeId),
                leaveType: form.leaveType,
                fromDate: form.fromDate,
                toDate: form.toDate,
                reason: form.reason
            });

            alert("Leave request submitted!");

            setForm({
                employeeId: "",
                leaveType: "CASUAL",
                fromDate: "",
                toDate: "",
                reason: ""
            });

            loadLeaves();

        } catch (error) {

            console.error("Leave error:", error);
            alert("Failed to submit leave request");

        }
    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(
                `/leaves/${id}/status?status=${status}`
            );

            alert(`Leave ${status.toLowerCase()}`);

            loadLeaves();

        } catch (error) {

            console.error("Status update error:", error);
            alert("Failed to update leave");

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

    // Calculate number of leave days
    const calculateDays = (fromDate, toDate) => {

        const from = new Date(fromDate);
        const to = new Date(toDate);

        const difference =
            (to - from) / (1000 * 60 * 60 * 24);

        return difference + 1;
    };

    // Calculate approved leave for employee
    const getApprovedLeaveDays = (employeeId) => {

        return leaves
            .filter(
                (leave) =>
                    leave.employeeId === employeeId &&
                    leave.status === "APPROVED"
            )
            .reduce(
                (total, leave) =>
                    total +
                    calculateDays(
                        leave.fromDate,
                        leave.toDate
                    ),
                0
            );
    };

    // Prototype yearly leave allowance
    const TOTAL_LEAVE = 24;

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1100px",
                margin: "auto"
            }}
        >

            <h1>Leave Management</h1>

            <hr />

            <h2>Apply Leave</h2>

            <form onSubmit={submitLeave}>

                <div>
                    <label>Employee</label>
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
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Leave Type</label>
                    <br />

                    <select
                        name="leaveType"
                        value={form.leaveType}
                        onChange={handleChange}
                    >
                        <option value="CASUAL">
                            Casual Leave
                        </option>

                        <option value="SICK">
                            Sick Leave
                        </option>

                        <option value="ANNUAL">
                            Annual Leave
                        </option>

                        <option value="OTHER">
                            Other
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>From Date</label>
                    <br />

                    <input
                        type="date"
                        name="fromDate"
                        value={form.fromDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>To Date</label>
                    <br />

                    <input
                        type="date"
                        name="toDate"
                        value={form.toDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Reason</label>
                    <br />

                    <textarea
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        placeholder="Enter reason"
                        rows="3"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Submit Leave Request
                </button>

            </form>

            <hr />

            <h2>Leave Balance</h2>

            <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                width="100%"
            >

                <thead>

                    <tr>
                        <th>Employee</th>
                        <th>Total Leave</th>
                        <th>Used Leave</th>
                        <th>Remaining Leave</th>
                    </tr>

                </thead>

                <tbody>

                    {employees.map((employee) => {

                        const used =
                            getApprovedLeaveDays(employee.id);

                        const remaining =
                            Math.max(
                                TOTAL_LEAVE - used,
                                0
                            );

                        return (
                            <tr key={employee.id}>

                                <td>
                                    {employee.name}
                                </td>

                                <td>
                                    {TOTAL_LEAVE}
                                </td>

                                <td>
                                    {used}
                                </td>

                                <td>
                                    {remaining}
                                </td>

                            </tr>
                        );
                    })}

                </tbody>

            </table>

            <hr />

            <h2>Leave Requests</h2>

            <p>
                Total Requests: {leaves.length}
            </p>

            <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                width="100%"
            >

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {leaves.map((leave) => (

                        <tr key={leave.id}>

                            <td>
                                {leave.id}
                            </td>

                            <td>
                                {getEmployeeName(
                                    leave.employeeId
                                )}
                            </td>

                            <td>
                                {leave.leaveType}
                            </td>

                            <td>
                                {leave.fromDate}
                            </td>

                            <td>
                                {leave.toDate}
                            </td>

                            <td>
                                {calculateDays(
                                    leave.fromDate,
                                    leave.toDate
                                )}
                            </td>

                            <td>
                                {leave.reason}
                            </td>

                            <td>
                                {leave.status}
                            </td>

                            <td>

                                {leave.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    leave.id,
                                                    "APPROVED"
                                                )
                                            }
                                        >
                                            Approve
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    leave.id,
                                                    "REJECTED"
                                                )
                                            }
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Leave;