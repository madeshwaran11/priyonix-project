import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [dashboard, setDashboard] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const response = await api.get("/dashboard");

            setDashboard(response.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const cardStyle = {
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "20px",
        minWidth: "180px",
        flex: "1",
        textAlign: "center",
        background: "#ffffff",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)"
    };

    const valueStyle = {
        fontSize: "28px",
        fontWeight: "700",
        marginTop: "10px",
        color: "#172033"
    };

    const sectionStyle = {
        marginBottom: "30px"
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px"
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        background: "white"
    };

    const thStyle = {
        padding: "12px",
        borderBottom: "1px solid #e2e8f0",
        textAlign: "left",
        color: "#172033",
        fontSize: "13px"
    };

    const tdStyle = {
        padding: "12px",
        borderBottom: "1px solid #f1f5f9",
        color: "#475569",
        fontSize: "13px"
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: "30px",
                    textAlign: "center"
                }}
            >
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <div>
                    <h1
                        style={{
                            marginBottom: "5px",
                            color: "#172033"
                        }}
                    >
                        Management Dashboard
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                            marginTop: 0
                        }}
                    >
                        PriyoniX Integrated Business ERP
                    </p>
                </div>

                <button
                    onClick={loadDashboard}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                            "linear-gradient(135deg, #1e40af, #06b6d4)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    🔄 Refresh Dashboard
                </button>
            </div>

            <hr />

            {/* ================= BUSINESS OVERVIEW ================= */}

            <div style={sectionStyle}>
                <h2>📊 Business Overview</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <h3>👥 Employees</h3>
                        <div style={valueStyle}>
                            {dashboard.employees || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🕒 Attendance</h3>
                        <div style={valueStyle}>
                            {dashboard.attendance || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>📋 Leave Requests</h3>
                        <div style={valueStyle}>
                            {dashboard.leaveRequests || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>⏳ Pending Leaves</h3>
                        <div style={valueStyle}>
                            {dashboard.pendingLeaves || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🎯 Leads</h3>
                        <div style={valueStyle}>
                            {dashboard.leads || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🤝 Clients</h3>
                        <div style={valueStyle}>
                            {dashboard.clients || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🔄 Converted Leads</h3>
                        <div style={valueStyle}>
                            {dashboard.convertedLeads || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= PROJECT MANAGEMENT ================= */}

            <div style={sectionStyle}>
                <h2>📁 Project Management</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <h3>Total Projects</h3>
                        <div style={valueStyle}>
                            {dashboard.projects || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🟢 Active Projects</h3>
                        <div style={valueStyle}>
                            {dashboard.activeProjects || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🔴 Delayed Projects</h3>
                        <div style={valueStyle}>
                            {dashboard.delayedProjects || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>✅ Total Tasks</h3>
                        <div style={valueStyle}>
                            {dashboard.tasks || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>📌 Open Tasks</h3>
                        <div style={valueStyle}>
                            {dashboard.openTasks || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🎯 Milestones</h3>
                        <div style={valueStyle}>
                            {dashboard.milestones || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>📝 Subtasks</h3>
                        <div style={valueStyle}>
                            {dashboard.subtasks || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FINANCE ================= */}

            <div style={sectionStyle}>
                <h2>💰 Financial Summary</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <h3>💵 Revenue</h3>
                        <div style={valueStyle}>
                            {formatCurrency(dashboard.revenue)}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🧾 Invoice Amount</h3>
                        <div style={valueStyle}>
                            {formatCurrency(dashboard.invoiceAmount)}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>⏳ Outstanding</h3>
                        <div style={valueStyle}>
                            {formatCurrency(
                                dashboard.outstandingAmount
                            )}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>💸 Total Expenses</h3>
                        <div style={valueStyle}>
                            {formatCurrency(
                                dashboard.totalExpenses
                            )}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>📈 Profit</h3>
                        <div
                            style={{
                                ...valueStyle,
                                color:
                                    Number(dashboard.profit || 0) >= 0
                                        ? "#16a34a"
                                        : "#dc2626"
                            }}
                        >
                            {formatCurrency(dashboard.profit)}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🧾 Invoices</h3>
                        <div style={valueStyle}>
                            {dashboard.invoices || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MARKETING ================= */}

            <div style={sectionStyle}>
                <h2>📣 Digital Marketing</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <h3>📢 Campaigns</h3>
                        <div style={valueStyle}>
                            {dashboard.campaigns || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🟢 Active Campaigns</h3>
                        <div style={valueStyle}>
                            {dashboard.activeCampaigns || 0}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>💰 Marketing Spend</h3>
                        <div style={valueStyle}>
                            {formatCurrency(
                                dashboard.marketingSpend
                            )}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3>🎯 Marketing Leads</h3>
                        <div style={valueStyle}>
                            {dashboard.leads || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= ALERTS ================= */}

            <div style={sectionStyle}>
                <h2>⚠️ Alerts & Attention Required</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <h3>🔴 Overdue Tasks</h3>

                        <div
                            style={{
                                ...valueStyle,
                                color: "#dc2626"
                            }}
                        >
                            {dashboard.overdueTasks || 0}
                        </div>

                        <p style={{ color: "#64748b" }}>
                            Tasks past their due date
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <h3>🔴 Overdue Invoices</h3>

                        <div
                            style={{
                                ...valueStyle,
                                color: "#dc2626"
                            }}
                        >
                            {dashboard.overdueInvoices || 0}
                        </div>

                        <p style={{ color: "#64748b" }}>
                            Unpaid invoices past due date
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <h3>🟠 Pending Leaves</h3>

                        <div
                            style={{
                                ...valueStyle,
                                color: "#d97706"
                            }}
                        >
                            {dashboard.pendingLeaves || 0}
                        </div>

                        <p style={{ color: "#64748b" }}>
                            Leave requests awaiting approval
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <h3>🔴 Delayed Projects</h3>

                        <div
                            style={{
                                ...valueStyle,
                                color: "#dc2626"
                            }}
                        >
                            {dashboard.delayedProjects || 0}
                        </div>

                        <p style={{ color: "#64748b" }}>
                            Projects past their planned end date
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= PROJECT REVENUE ================= */}

            <div style={sectionStyle}>
                <h2>💰 Project-wise Revenue</h2>

                <div
                    style={{
                        background: "white",
                        borderRadius: "14px",
                        padding: "20px",
                        overflowX: "auto",
                        boxShadow:
                            "0 6px 18px rgba(15,23,42,0.06)"
                    }}
                >
                    {dashboard.projectRevenue &&
                    dashboard.projectRevenue.length > 0 ? (
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>
                                        Project
                                    </th>

                                    <th style={thStyle}>
                                        Revenue
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard.projectRevenue.map(
                                    (project) => (
                                        <tr
                                            key={
                                                project.projectId
                                            }
                                        >
                                            <td style={tdStyle}>
                                                {
                                                    project.projectName
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                {formatCurrency(
                                                    project.revenue
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            No project revenue data available.
                        </p>
                    )}
                </div>
            </div>

            {/* ================= CAMPAIGN PERFORMANCE ================= */}

            <div style={sectionStyle}>
                <h2>📊 Campaign Performance</h2>

                <div
                    style={{
                        background: "white",
                        borderRadius: "14px",
                        padding: "20px",
                        overflowX: "auto",
                        boxShadow:
                            "0 6px 18px rgba(15,23,42,0.06)"
                    }}
                >
                    {dashboard.campaignPerformance &&
                    dashboard.campaignPerformance.length > 0 ? (
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>
                                        Campaign
                                    </th>

                                    <th style={thStyle}>
                                        Platform
                                    </th>

                                    <th style={thStyle}>
                                        Reach
                                    </th>

                                    <th style={thStyle}>
                                        Engagement
                                    </th>

                                    <th style={thStyle}>
                                        Conversions
                                    </th>

                                    <th style={thStyle}>
                                        Spend
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard.campaignPerformance.map(
                                    (campaign) => (
                                        <tr
                                            key={campaign.id}
                                        >
                                            <td style={tdStyle}>
                                                {
                                                    campaign.campaignName
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    campaign.platform
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    campaign.reach ??
                                                    0
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    campaign.engagement ??
                                                    0
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    campaign.conversions ??
                                                    0
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {formatCurrency(
                                                    campaign.spend
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            No campaign performance data
                            available.
                        </p>
                    )}
                </div>
            </div>

            {/* ================= WORKFLOW ================= */}

            <div style={sectionStyle}>
                <h2>🔗 ERP Connected Workflow</h2>

                <div
                    style={{
                        background:
                            "linear-gradient(135deg, #eff6ff, #ecfeff)",
                        border:
                            "1px solid #bae6fd",
                        borderRadius: "14px",
                        padding: "24px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#172033"
                    }}
                >
                    📣 Marketing Campaign
                    {" → "}
                    🎯 Lead
                    {" → "}
                    🤝 Client
                    {" → "}
                    📁 Project
                    {" → "}
                    👨‍💻 Employee
                    {" → "}
                    ✅ Task
                    {" → "}
                    🧾 Invoice
                    {" → "}
                    📊 Dashboard
                </div>
            </div>

            <hr />

            {/* FOOTER */}

            <div
                style={{
                    textAlign: "center",
                    marginTop: "20px",
                    color: "#64748b"
                }}
            >
                <p>
                    PriyoniX Integrated Business ERP
                </p>

                <p>
                    Dashboard connected to HR, CRM,
                    Projects, Finance and Marketing
                </p>
            </div>
        </div>
    );
}

export default Dashboard;