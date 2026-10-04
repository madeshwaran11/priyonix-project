import { useEffect, useState } from "react";
import api from "../api";

function ContentCalendar() {
    const [items, setItems] = useState([]);
    const [campaigns, setCampaigns] = useState([]);

    const [form, setForm] = useState({
        campaignId: "",
        contentTitle: "",
        platform: "Instagram",
        contentType: "POST",
        scheduledDate: "",
        status: "PLANNED"
    });

    const loadData = async () => {
        try {
            const [contentRes, campaignRes] = await Promise.all([
                api.get("/content-calendar"),
                api.get("/campaigns")
            ]);

            setItems(contentRes.data);
            setCampaigns(campaignRes.data);
        } catch (error) {
            console.error("Failed to load content calendar:", error);
            alert("Failed to load content calendar");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addContent = async (e) => {
        e.preventDefault();

        if (
            !form.campaignId ||
            !form.contentTitle.trim() ||
            !form.scheduledDate
        ) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await api.post("/content-calendar", {
                campaignId: Number(form.campaignId),
                contentTitle: form.contentTitle,
                platform: form.platform,
                contentType: form.contentType,
                scheduledDate: form.scheduledDate,
                status: form.status
            });

            alert("Content scheduled successfully");

            setForm({
                campaignId: "",
                contentTitle: "",
                platform: "Instagram",
                contentType: "POST",
                scheduledDate: "",
                status: "PLANNED"
            });

            loadData();
        } catch (error) {
            console.error(error);
            alert("Failed to create content");
        }
    };

    const deleteContent = async (id) => {
        if (!window.confirm("Delete this content?")) {
            return;
        }

        try {
            await api.delete(`/content-calendar/${id}`);
            loadData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete content");
        }
    };

    const updateStatus = async (item, status) => {
        try {
            await api.put(`/content-calendar/${item.id}`, {
                campaignId: item.campaignId,
                contentTitle: item.contentTitle,
                platform: item.platform,
                contentType: item.contentType,
                scheduledDate: item.scheduledDate,
                status
            });

            loadData();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const getCampaignName = (campaignId) => {
        const campaign = campaigns.find(
            (item) => item.id === Number(campaignId)
        );

        return campaign ? campaign.campaignName : "Unknown Campaign";
    };

    const plannedCount = items.filter(
        (item) => item.status === "PLANNED"
    ).length;

    const publishedCount = items.filter(
        (item) => item.status === "PUBLISHED"
    ).length;

    const totalCount = items.length;

    return (
        <div>
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#172033"
                        }}
                    >
                        📅 Content Calendar
                    </h2>

                    <p
                        style={{
                            marginTop: "6px",
                            color: "#64748b"
                        }}
                    >
                        Schedule and manage marketing content.
                    </p>
                </div>
            </div>

            {/* SUMMARY */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "18px",
                    marginBottom: "24px"
                }}
            >
                <div className="dashboard-card">
                    <div className="dashboard-card-title">
                        Total Content
                    </div>

                    <div className="dashboard-card-value">
                        {totalCount}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-title">
                        Planned
                    </div>

                    <div className="dashboard-card-value">
                        {plannedCount}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-title">
                        Published
                    </div>

                    <div className="dashboard-card-value">
                        {publishedCount}
                    </div>
                </div>
            </div>

            {/* ADD CONTENT */}
            <div
                style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "14px",
                    marginBottom: "24px",
                    boxShadow: "0 6px 20px rgba(15,23,42,0.08)"
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        color: "#172033"
                    }}
                >
                    ➕ Schedule Content
                </h3>

                <form onSubmit={addContent}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "16px"
                        }}
                    >
                        <div>
                            <label>Campaign *</label>

                            <select
                                name="campaignId"
                                value={form.campaignId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Campaign
                                </option>

                                {campaigns.map((campaign) => (
                                    <option
                                        key={campaign.id}
                                        value={campaign.id}
                                    >
                                        {campaign.campaignName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Content Title *</label>

                            <input
                                type="text"
                                name="contentTitle"
                                value={form.contentTitle}
                                onChange={handleChange}
                                placeholder="Enter content title"
                                required
                            />
                        </div>

                        <div>
                            <label>Platform</label>

                            <select
                                name="platform"
                                value={form.platform}
                                onChange={handleChange}
                            >
                                <option value="Instagram">
                                    Instagram
                                </option>
                                <option value="Facebook">
                                    Facebook
                                </option>
                                <option value="LinkedIn">
                                    LinkedIn
                                </option>
                                <option value="YouTube">
                                    YouTube
                                </option>
                                <option value="Twitter">
                                    Twitter / X
                                </option>
                            </select>
                        </div>

                        <div>
                            <label>Content Type</label>

                            <select
                                name="contentType"
                                value={form.contentType}
                                onChange={handleChange}
                            >
                                <option value="POST">Post</option>
                                <option value="REEL">Reel</option>
                                <option value="VIDEO">Video</option>
                                <option value="STORY">Story</option>
                                <option value="BLOG">Blog</option>
                                <option value="ADVERTISEMENT">
                                    Advertisement
                                </option>
                            </select>
                        </div>

                        <div>
                            <label>Scheduled Date *</label>

                            <input
                                type="date"
                                name="scheduledDate"
                                value={form.scheduledDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Status</label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="PLANNED">
                                    Planned
                                </option>
                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>
                                <option value="PUBLISHED">
                                    Published
                                </option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: "20px",
                            padding: "11px 22px",
                            border: "none",
                            borderRadius: "8px",
                            background:
                                "linear-gradient(135deg, #1e40af, #06b6d4)",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        📅 Schedule Content
                    </button>
                </form>
            </div>

            {/* CONTENT LIST */}
            <div
                style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "14px",
                    boxShadow: "0 6px 20px rgba(15,23,42,0.08)"
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        color: "#172033"
                    }}
                >
                    📋 Content Schedule
                </h3>

                {items.length === 0 ? (
                    <p style={{ color: "#64748b" }}>
                        No content scheduled yet.
                    </p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Campaign</th>
                                    <th>Platform</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <strong>
                                                {item.contentTitle}
                                            </strong>
                                        </td>

                                        <td>
                                            {getCampaignName(
                                                item.campaignId
                                            )}
                                        </td>

                                        <td>{item.platform}</td>

                                        <td>{item.contentType}</td>

                                        <td>
                                            {item.scheduledDate}
                                        </td>

                                        <td>
                                            <span
                                                style={{
                                                    padding:
                                                        "5px 9px",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        item.status ===
                                                        "PUBLISHED"
                                                            ? "#dcfce7"
                                                            : "#e0f2fe",
                                                    color:
                                                        item.status ===
                                                        "PUBLISHED"
                                                            ? "#166534"
                                                            : "#075985",
                                                    fontSize: "12px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        <td>
                                            {item.status !==
                                                "PUBLISHED" && (
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            item,
                                                            "PUBLISHED"
                                                        )
                                                    }
                                                    style={{
                                                        marginRight:
                                                            "6px",
                                                        padding:
                                                            "6px 10px",
                                                        border: "none",
                                                        borderRadius:
                                                            "6px",
                                                        background:
                                                            "#16a34a",
                                                        color: "white",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    Publish
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    deleteContent(
                                                        item.id
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "6px 10px",
                                                    border: "none",
                                                    borderRadius:
                                                        "6px",
                                                    background:
                                                        "#dc2626",
                                                    color: "white",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContentCalendar;