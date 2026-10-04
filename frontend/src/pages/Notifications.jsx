import { useEffect, useState } from "react";
import api from "../services/api";

function Notifications() {
    const [dashboard, setDashboard] = useState({});
    const [leads, setLeads] = useState([]);
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const dashboardResponse =
                await api.get("/dashboard");

            const leadsResponse =
                await api.get("/leads");

            const leavesResponse =
                await api.get("/leaves");

            setDashboard(dashboardResponse.data);
            setLeads(leadsResponse.data);
            setLeaves(leavesResponse.data);

        } catch (error) {
            console.error(
                "Error loading notifications:",
                error
            );
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followUpLeads = leads.filter((lead) => {
        if (!lead.followUpDate) {
            return false;
        }

        const followUpDate =
            new Date(lead.followUpDate);

        followUpDate.setHours(0, 0, 0, 0);

        return (
            followUpDate <= today &&
            lead.status !== "CONVERTED"
        );
    });

    const pendingLeaves = leaves.filter(
        (leave) => leave.status === "PENDING"
    );

    const notificationCount =
        Number(dashboard.overdueTasks || 0) +
        Number(dashboard.overdueInvoices || 0) +
        pendingLeaves.length +
        followUpLeads.length;

    const notificationStyle = {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "15px",
        background: "#f8f9fa"
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "auto"
            }}
        >
            <h1>ERP Notifications</h1>

            <p>
                Automated business alerts and pending
                actions
            </p>

            <hr />

            <h2>
                Notifications: {notificationCount}
            </h2>

            {/* OVERDUE TASKS */}

            {Number(dashboard.overdueTasks || 0) > 0 && (
                <div style={notificationStyle}>
                    <h3>⚠️ Overdue Tasks</h3>

                    <p>
                        {dashboard.overdueTasks} task(s)
                        are past their due date.
                    </p>

                    <p>
                        Action: Project Manager should
                        review these tasks.
                    </p>
                </div>
            )}

            {/* OVERDUE INVOICES */}

            {Number(
                dashboard.overdueInvoices || 0
            ) > 0 && (
                <div style={notificationStyle}>
                    <h3>💰 Overdue Invoices</h3>

                    <p>
                        {dashboard.overdueInvoices} invoice(s)
                        are overdue.
                    </p>

                    <p>
                        Action: Finance team should
                        follow up on pending payments.
                    </p>
                </div>
            )}

            {/* PENDING LEAVES */}

            {pendingLeaves.map((leave) => (
                <div
                    key={leave.id}
                    style={notificationStyle}
                >
                    <h3>🏖️ Leave Approval Required</h3>

                    <p>
                        Employee ID:{" "}
                        {leave.employeeId}
                    </p>

                    <p>
                        Leave Type:{" "}
                        {leave.leaveType}
                    </p>

                    <p>
                        From: {leave.fromDate}
                    </p>

                    <p>
                        To: {leave.toDate}
                    </p>

                    <p>
                        Action: HR should review this
                        leave request.
                    </p>
                </div>
            ))}

            {/* FOLLOW-UP LEADS */}

            {followUpLeads.map((lead) => (
                <div
                    key={lead.id}
                    style={notificationStyle}
                >
                    <h3>📞 Lead Follow-up</h3>

                    <p>
                        Company:{" "}
                        {lead.companyName}
                    </p>

                    <p>
                        Contact:{" "}
                        {lead.contactName}
                    </p>

                    <p>
                        Follow-up Date:{" "}
                        {lead.followUpDate}
                    </p>

                    <p>
                        Opportunity Value: ₹
                        {Number(
                            lead.opportunityValue || 0
                        ).toLocaleString("en-IN")}
                    </p>

                    <p>
                        Action: Sales/CRM team should
                        follow up with this lead.
                    </p>
                </div>
            ))}

            {/* NO NOTIFICATIONS */}

            {notificationCount === 0 && (
                <div
                    style={{
                        padding: "30px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        borderRadius: "8px"
                    }}
                >
                    <h2>✅ No pending alerts</h2>

                    <p>
                        All current business activities
                        are up to date.
                    </p>
                </div>
            )}

            <br />

            <button onClick={loadData}>
                Refresh Notifications
            </button>
        </div>
    );
}

export default Notifications;