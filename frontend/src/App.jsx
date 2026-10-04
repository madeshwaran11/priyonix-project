import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Lead from "./pages/Lead";
import Clients from "./pages/Clients";
import Department from "./pages/Department";
import Designation from "./pages/Designation";
import Role from "./pages/Role";
import Projects from "./pages/Projects";
import ProjectTeam from "./pages/ProjectTeam";
import Milestones from "./pages/Milestones";
import Tasks from "./pages/Tasks";
import Invoices from "./pages/Invoices";
import Expense from "./pages/Expense";
import Campaigns from "./pages/Campaigns";
import ContentCalendar from "./pages/ContentCalendar";

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("loggedInUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [page, setPage] = useState("dashboard");

    const handleLogin = (loggedInUser) => {
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);
        setPage("dashboard");
    };

    const logout = () => {
        localStorage.removeItem("loggedInUser");
        setUser(null);
        setPage("dashboard");
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    const role = user.role?.toUpperCase() || "";

    /* =========================
       ROLE BASED ACCESS
    ========================= */

    const allowedPages = {
        SUPER_ADMIN: [
            "dashboard",
            "notifications",
            "employees",
            "attendance",
            "leave",
            "lead",
            "clients",
            "department",
            "designation",
            "role",
            "projects",
            "projectTeam",
            "milestones",
            "tasks",
            "invoices",
            "expense",
            "campaigns",
            "contentCalendar"
        ],

        HR: [
            "dashboard",
            "notifications",
            "employees",
            "attendance",
            "leave",
            "department",
            "designation"
        ],

        PROJECT_MANAGER: [
            "dashboard",
            "notifications",
            "projects",
            "projectTeam",
            "milestones",
            "tasks"
        ],

        EMPLOYEE: [
            "dashboard",
            "notifications",
            "attendance",
            "leave",
            "tasks"
        ],

        SALES_CRM: [
            "dashboard",
            "notifications",
            "lead",
            "clients"
        ],

        MARKETING: [
            "dashboard",
            "notifications",
            "campaigns",
            "contentCalendar",
            "lead"
        ],

        FINANCE: [
            "dashboard",
            "notifications",
            "invoices",
            "expense"
        ]
    };

    const isAdmin = role === "SUPER_ADMIN";

    const hasPageAccess = (pageName) => {
        return (
            isAdmin ||
            (allowedPages[role] || []).includes(pageName)
        );
    };

    const hasAccess = (roles) => {
        return isAdmin || roles.includes(role);
    };

    const goToPage = (pageName) => {
        if (hasPageAccess(pageName)) {
            setPage(pageName);
        }
    };

    /* =========================
       SIDEBAR MENU ITEM
    ========================= */

    const menuItem = (icon, text, pageName) => (
        <button
            type="button"
            onClick={() => goToPage(pageName)}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                marginBottom: "5px",
                border: "none",
                borderRadius: "8px",
                background:
                    page === pageName
                        ? "rgba(255,255,255,0.15)"
                        : "transparent",
                color: "white",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight:
                    page === pageName ? "600" : "400"
            }}
        >
            <span style={{ fontSize: "18px" }}>
                {icon}
            </span>

            <span>
                {text}
            </span>
        </button>
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb"
            }}
        >

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside
                className="erp-sidebar"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "245px",
                    background:
                        "linear-gradient(180deg, #0f2c78 0%, #123b91 55%, #0e7490 100%)",
                    color: "white",
                    padding: "20px 14px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow:
                        "4px 0 20px rgba(15,23,42,0.15)"
                }}
            >

                {/* =========================
                    LOGO
                ========================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "5px 8px 22px",
                        borderBottom:
                            "1px solid rgba(255,255,255,0.15)",
                        marginBottom: "18px"
                    }}
                >

                    <img
                        src="/priyonix-logo.jpeg"
                        alt="PriyoniX"
                        style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "contain",
                            borderRadius: "10px",
                            background: "white",
                            padding: "3px",
                            display: "block"
                        }}
                    />

                    <div className="erp-sidebar-text">

                        <div
                            style={{
                                fontSize: "20px",
                                fontWeight: "700"
                            }}
                        >
                            PriyoniX
                        </div>

                        <div
                            style={{
                                fontSize: "11px",
                                opacity: 0.75
                            }}
                        >
                            BUSINESS ERP
                        </div>

                    </div>

                </div>

                {/* =========================
                    MAIN
                ========================= */}

                <div className="erp-sidebar-text">
                    <div
                        style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            opacity: 0.6,
                            margin: "10px 12px"
                        }}
                    >
                        Main
                    </div>
                </div>

                {menuItem(
                    "📊",
                    "Dashboard",
                    "dashboard"
                )}

                {menuItem(
                    "🔔",
                    "Notifications",
                    "notifications"
                )}

                {/* =========================
                    HR
                ========================= */}

                {hasAccess(["HR"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            Human Resources
                        </div>

                        {menuItem(
                            "👥",
                            "Employees",
                            "employees"
                        )}

                        {menuItem(
                            "🕒",
                            "Attendance",
                            "attendance"
                        )}

                        {menuItem(
                            "📅",
                            "Leave Management",
                            "leave"
                        )}

                        {menuItem(
                            "🏢",
                            "Departments",
                            "department"
                        )}

                        {menuItem(
                            "💼",
                            "Designations",
                            "designation"
                        )}
                    </>
                )}

                {/* =========================
                    CRM
                ========================= */}

                {hasAccess(["SALES_CRM"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            CRM
                        </div>

                        {menuItem(
                            "🎯",
                            "Leads",
                            "lead"
                        )}

                        {menuItem(
                            "🤝",
                            "Clients",
                            "clients"
                        )}
                    </>
                )}

                {/* =========================
                    PROJECT MANAGEMENT
                ========================= */}

                {hasAccess(["PROJECT_MANAGER"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            Project Management
                        </div>

                        {menuItem(
                            "📁",
                            "Projects",
                            "projects"
                        )}

                        {menuItem(
                            "👨‍💻",
                            "Project Team",
                            "projectTeam"
                        )}

                        {menuItem(
                            "🎯",
                            "Milestones",
                            "milestones"
                        )}

                        {menuItem(
                            "✅",
                            "Tasks",
                            "tasks"
                        )}
                    </>
                )}

                {/* =========================
                    EMPLOYEE
                ========================= */}

                {hasAccess(["EMPLOYEE"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            My Work
                        </div>

                        {menuItem(
                            "🕒",
                            "Attendance",
                            "attendance"
                        )}

                        {menuItem(
                            "📅",
                            "Leave",
                            "leave"
                        )}

                        {menuItem(
                            "✅",
                            "My Tasks",
                            "tasks"
                        )}
                    </>
                )}

                {/* =========================
                    FINANCE
                ========================= */}

                {hasAccess(["FINANCE"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            Finance
                        </div>

                        {menuItem(
                            "🧾",
                            "Invoices",
                            "invoices"
                        )}

                        {menuItem(
                            "💰",
                            "Expenses",
                            "expense"
                        )}
                    </>
                )}

                {/* =========================
                    MARKETING
                ========================= */}

                {hasAccess(["MARKETING"]) && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            Marketing
                        </div>

                        {menuItem(
                            "📢",
                            "Campaigns",
                            "campaigns"
                        )}

                        {menuItem(
                            "📅",
                            "Content Calendar",
                            "contentCalendar"
                        )}

                        {menuItem(
                            "🎯",
                            "Marketing Leads",
                            "lead"
                        )}
                    </>
                )}

                {/* =========================
                    ADMIN
                ========================= */}

                {isAdmin && (
                    <>
                        <div
                            className="erp-sidebar-text"
                            style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                opacity: 0.6,
                                margin: "22px 12px 8px"
                            }}
                        >
                            Administration
                        </div>

                        {menuItem(
                            "🔐",
                            "Roles",
                            "role"
                        )}
                    </>
                )}

                {/* =========================
                    LOGOUT
                ========================= */}

                <div
                    style={{
                        marginTop: "25px",
                        paddingTop: "15px",
                        borderTop:
                            "1px solid rgba(255,255,255,0.15)"
                    }}
                >

                    <button
                        type="button"
                        onClick={logout}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            borderRadius: "8px",
                            background:
                                "rgba(255,255,255,0.12)",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        🚪{" "}
                        <span className="erp-sidebar-text">
                            Logout
                        </span>
                    </button>

                </div>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main
                className="erp-main"
                style={{
                    marginLeft: "245px",
                    minHeight: "100vh"
                }}
            >

                {/* =========================
                    HEADER
                ========================= */}

                <header
                    style={{
                        height: "72px",
                        background: "white",
                        borderBottom:
                            "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 28px",
                        position: "sticky",
                        top: 0,
                        zIndex: 900
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                color: "#172033"
                            }}
                        >
                            {getPageTitle(page)}
                        </h2>

                        <span
                            style={{
                                color: "#94a3b8",
                                fontSize: "12px"
                            }}
                        >
                            PriyoniX Integrated Business ERP
                        </span>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >

                        <div
                            style={{
                                textAlign: "right"
                            }}
                        >

                            <div
                                style={{
                                    fontWeight: "600",
                                    fontSize: "14px"
                                }}
                            >
                                {user.name}
                            </div>

                            <div
                                style={{
                                    color: "#64748b",
                                    fontSize: "12px"
                                }}
                            >
                                {user.role}
                            </div>

                        </div>

                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, #1e40af, #06b6d4)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700"
                            }}
                        >
                            {user.name
                                ? user.name
                                      .charAt(0)
                                      .toUpperCase()
                                : "U"}
                        </div>

                    </div>

                </header>

                {/* =========================
                    PAGE CONTENT
                ========================= */}

                <div
                    style={{
                        padding: "28px"
                    }}
                >

                    {page === "dashboard" &&
                        hasPageAccess("dashboard") && (
                            <Dashboard />
                        )}

                    {page === "notifications" &&
                        hasPageAccess("notifications") && (
                            <Notifications />
                        )}

                    {page === "employees" &&
                        hasAccess(["HR"]) && (
                            <Employees />
                        )}

                    {page === "attendance" &&
                        hasAccess([
                            "HR",
                            "EMPLOYEE"
                        ]) && (
                            <Attendance />
                        )}

                    {page === "leave" &&
                        hasAccess([
                            "HR",
                            "EMPLOYEE"
                        ]) && (
                            <Leave />
                        )}

                    {page === "lead" &&
                        hasAccess([
                            "SALES_CRM",
                            "MARKETING"
                        ]) && (
                            <Lead />
                        )}

                    {page === "clients" &&
                        hasAccess([
                            "SALES_CRM"
                        ]) && (
                            <Clients />
                        )}

                    {page === "department" &&
                        hasAccess(["HR"]) && (
                            <Department />
                        )}

                    {page === "designation" &&
                        hasAccess(["HR"]) && (
                            <Designation />
                        )}

                    {page === "role" &&
                        isAdmin && (
                            <Role />
                        )}

                    {page === "projects" &&
                        hasAccess([
                            "PROJECT_MANAGER"
                        ]) && (
                            <Projects />
                        )}

                    {page === "projectTeam" &&
                        hasAccess([
                            "PROJECT_MANAGER"
                        ]) && (
                            <ProjectTeam />
                        )}

                    {page === "milestones" &&
                        hasAccess([
                            "PROJECT_MANAGER"
                        ]) && (
                            <Milestones />
                        )}

                    {page === "tasks" &&
                        hasAccess([
                            "PROJECT_MANAGER",
                            "EMPLOYEE"
                        ]) && (
                            <Tasks />
                        )}

                    {page === "invoices" &&
                        hasAccess([
                            "FINANCE"
                        ]) && (
                            <Invoices />
                        )}

                    {page === "expense" &&
                        hasAccess([
                            "FINANCE"
                        ]) && (
                            <Expense />
                        )}

                    {page === "campaigns" &&
                        hasAccess([
                            "MARKETING"
                        ]) && (
                            <Campaigns />
                        )}

                    {page === "contentCalendar" &&
                        hasAccess([
                            "MARKETING"
                        ]) && (
                            <ContentCalendar />
                        )}

                    {!hasPageAccess(page) && (
                        <div
                            style={{
                                background: "white",
                                borderRadius: "14px",
                                padding: "40px",
                                textAlign: "center",
                                color: "#172033",
                                boxShadow:
                                    "0 8px 25px rgba(15,23,42,0.08)"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "12px"
                                }}
                            >
                                🔒
                            </div>

                            <h2
                                style={{
                                    margin: "0 0 8px"
                                }}
                            >
                                Access Restricted
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#64748b"
                                }}
                            >
                                You do not have permission
                                to access this module.
                            </p>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}


/* =========================
   PAGE TITLES
========================= */

function getPageTitle(page) {
    const titles = {
        dashboard: "Dashboard",
        notifications: "Notifications",
        employees: "Employee Management",
        attendance: "Attendance",
        leave: "Leave Management",
        lead: "CRM & Leads",
        clients: "Client Management",
        department: "Departments",
        designation: "Designations",
        role: "Role Management",
        projects: "Project Management",
        projectTeam: "Project Team",
        milestones: "Project Milestones",
        tasks: "Task Management",
        invoices: "Finance & Invoices",
        expense: "Expense Management",
        campaigns: "Digital Marketing",
        contentCalendar: "Content Calendar"
    };

    return titles[page] || "PriyoniX ERP";
}

export default App;