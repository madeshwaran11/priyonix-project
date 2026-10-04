import { useEffect, useState } from "react";
import api from "../services/api";

function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);

    const [form, setForm] = useState({
        campaignName: "",
        objective: "",
        platform: "Instagram",
        startDate: "",
        endDate: "",
        budget: "",
        spend: 0,
        reach: 0,
        engagement: 0,
        conversions: 0,
        status: "PLANNED"
    });

    const loadCampaigns = async () => {
        try {
            const response = await api.get("/campaigns");
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error loading campaigns:", error);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addCampaign = async (event) => {
        event.preventDefault();

        try {
            await api.post("/campaigns", {
                ...form,
                budget: Number(form.budget),
                spend: Number(form.spend),
                reach: Number(form.reach),
                engagement: Number(form.engagement),
                conversions: Number(form.conversions)
            });

            alert("Campaign created successfully!");

            setForm({
                campaignName: "",
                objective: "",
                platform: "Instagram",
                startDate: "",
                endDate: "",
                budget: "",
                spend: 0,
                reach: 0,
                engagement: 0,
                conversions: 0,
                status: "PLANNED"
            });

            loadCampaigns();

        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Failed to create campaign");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/campaigns/${id}/status?status=${status}`
            );

            loadCampaigns();

        } catch (error) {
            console.error("Error updating campaign:", error);
        }
    };

    const calculateROI = (campaign) => {
        const spend = Number(campaign.spend || 0);
        const conversions = Number(campaign.conversions || 0);

        if (spend === 0) {
            return 0;
        }

        return (
            ((conversions - spend) / spend) *
            100
        ).toFixed(2);
    };

    const calculateCostPerConversion = (campaign) => {
        const spend = Number(campaign.spend || 0);
        const conversions = Number(
            campaign.conversions || 0
        );

        if (conversions === 0) {
            return 0;
        }

        return (spend / conversions).toFixed(2);
    };

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1500px",
                margin: "auto"
            }}
        >

            <h1>Digital Marketing</h1>

            <hr />

            <h2>Create Campaign</h2>

            <form onSubmit={addCampaign}>

                <input
                    name="campaignName"
                    placeholder="Campaign Name"
                    value={form.campaignName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="objective"
                    placeholder="Objective"
                    value={form.objective}
                    onChange={handleChange}
                />

                <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                >
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Google Ads</option>
                    <option>LinkedIn</option>
                    <option>YouTube</option>
                </select>

                <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                />

                <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                />

                <input
                    name="budget"
                    type="number"
                    placeholder="Budget"
                    value={form.budget}
                    onChange={handleChange}
                    required
                />

                <input
                    name="spend"
                    type="number"
                    placeholder="Spend"
                    value={form.spend}
                    onChange={handleChange}
                />

                <input
                    name="reach"
                    type="number"
                    placeholder="Reach"
                    value={form.reach}
                    onChange={handleChange}
                />

                <input
                    name="engagement"
                    type="number"
                    placeholder="Engagement"
                    value={form.engagement}
                    onChange={handleChange}
                />

                <input
                    name="conversions"
                    type="number"
                    placeholder="Conversions"
                    value={form.conversions}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Create Campaign
                </button>

            </form>

            <hr />

            <h2>Campaign List</h2>

            <p>
                Total Campaigns: {campaigns.length}
            </p>

            <table
                border="1"
                cellPadding="10"
                style={{ width: "100%" }}
            >

                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Platform</th>
                        <th>Budget</th>
                        <th>Spend</th>
                        <th>Reach</th>
                        <th>Engagement</th>
                        <th>Conversions</th>
                        <th>ROI</th>
                        <th>Cost / Conversion</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {campaigns.map((campaign) => (

                        <tr key={campaign.id}>

                            <td>
                                {campaign.campaignName}
                            </td>

                            <td>
                                {campaign.platform}
                            </td>

                            <td>
                                ₹{campaign.budget}
                            </td>

                            <td>
                                ₹{campaign.spend}
                            </td>

                            <td>
                                {campaign.reach}
                            </td>

                            <td>
                                {campaign.engagement}
                            </td>

                            <td>
                                {campaign.conversions}
                            </td>

                            <td>
                                {calculateROI(campaign)}%
                            </td>

                            <td>
                                ₹
                                {calculateCostPerConversion(
                                    campaign
                                )}
                            </td>

                            <td>
                                {campaign.status}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            campaign.id,
                                            "ACTIVE"
                                        )
                                    }
                                >
                                    Activate
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            campaign.id,
                                            "COMPLETED"
                                        )
                                    }
                                >
                                    Complete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Campaigns;