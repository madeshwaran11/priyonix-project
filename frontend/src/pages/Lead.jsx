import { useEffect, useState } from "react";
import api from "../services/api";

function Lead() {
    const [leads, setLeads] = useState([]);
    const [campaigns, setCampaigns] = useState([]);

    const [form, setForm] = useState({
        campaignId: "",
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        leadSource: "",
        requirement: "",
        followUpDate: "",
        salesOwner: "",
        opportunityValue: ""
    });

    useEffect(() => {
        loadLeads();
        loadCampaigns();
    }, []);

    const loadLeads = async () => {
        try {
            const response = await api.get("/leads");
            setLeads(response.data);
        } catch (error) {
            console.error("Error loading leads:", error);
        }
    };

    const loadCampaigns = async () => {
        try {
            const response = await api.get("/campaigns");
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error loading campaigns:", error);
        }
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const addLead = async (event) => {
        event.preventDefault();

        if (!form.companyName.trim()) {
            alert("Please enter company name");
            return;
        }

        if (!form.contactName.trim()) {
            alert("Please enter contact name");
            return;
        }

        if (
            form.opportunityValue &&
            Number(form.opportunityValue) < 0
        ) {
            alert("Opportunity value cannot be negative");
            return;
        }

        try {
            await api.post("/leads", {
                ...form,

                campaignId: form.campaignId
                    ? Number(form.campaignId)
                    : null,

                opportunityValue: form.opportunityValue
                    ? Number(form.opportunityValue)
                    : 0
            });

            alert("Lead added successfully!");

            setForm({
                campaignId: "",
                companyName: "",
                contactName: "",
                email: "",
                phone: "",
                leadSource: "",
                requirement: "",
                followUpDate: "",
                salesOwner: "",
                opportunityValue: ""
            });

            loadLeads();

        } catch (error) {
            console.error("Error adding lead:", error);
            alert("Failed to add lead");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/leads/${id}/status?status=${status}`
            );

            loadLeads();

        } catch (error) {
            console.error(
                "Error updating lead:",
                error
            );

            alert("Failed to update lead status");
        }
    };

    const convertToClient = async (id) => {
        const confirmConvert = window.confirm(
            "Convert this lead into a client?"
        );

        if (!confirmConvert) {
            return;
        }

        try {
            await api.post(`/leads/${id}/convert`);

            alert(
                "Lead converted to client successfully!"
            );

            loadLeads();

        } catch (error) {
            console.error(
                "Error converting lead:",
                error
            );

            alert("Failed to convert lead");
        }
    };

    const getCampaignName = (campaignId) => {
        const campaign = campaigns.find(
            (campaign) => campaign.id === campaignId
        );

        return campaign
            ? campaign.campaignName
            : `Campaign ID: ${campaignId}`;
    };

    const totalOpportunity = leads.reduce(
        (sum, lead) =>
            sum + Number(lead.opportunityValue || 0),
        0
    );

    const newLeads = leads.filter(
        (lead) => lead.status === "NEW"
    ).length;

    const contactedLeads = leads.filter(
        (lead) => lead.status === "CONTACTED"
    ).length;

    const convertedLeads = leads.filter(
        (lead) => lead.status === "CONVERTED"
    ).length;

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "auto"
            }}
        >
            <h1>CRM / Lead Management</h1>

            <p>
                Marketing Campaign → Lead → CRM →
                Client
            </p>

            <hr />

            {/* SUMMARY */}

            <h2>CRM Summary</h2>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "30px"
                }}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Total Leads</h3>
                    <h2>{leads.length}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>New Leads</h3>
                    <h2>{newLeads}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Contacted</h3>
                    <h2>{contactedLeads}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>Converted</h3>
                    <h2>{convertedLeads}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "220px"
                    }}
                >
                    <h3>Opportunity Value</h3>
                    <h2>
                        ₹
                        {totalOpportunity.toLocaleString(
                            "en-IN"
                        )}
                    </h2>
                </div>
            </div>

            <hr />

            {/* CREATE LEAD */}

            <h2>Create Lead</h2>

            <form onSubmit={addLead}>

                <select
                    name="campaignId"
                    value={form.campaignId}
                    onChange={handleChange}
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

                <br />
                <br />

                <input
                    name="companyName"
                    placeholder="Company Name"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="contactName"
                    placeholder="Contact Name"
                    value={form.contactName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="leadSource"
                    placeholder="Lead Source"
                    value={form.leadSource}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="requirement"
                    placeholder="Requirement"
                    value={form.requirement}
                    onChange={handleChange}
                />

                <br />
                <br />

                <label>Follow-up Date</label>

                <br />

                <input
                    name="followUpDate"
                    type="date"
                    value={form.followUpDate}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="salesOwner"
                    placeholder="Sales Owner"
                    value={form.salesOwner}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    name="opportunityValue"
                    type="number"
                    min="0"
                    placeholder="Opportunity Value"
                    value={form.opportunityValue}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button type="submit">
                    Create Lead
                </button>

            </form>

            <hr />

            {/* LEAD LIST */}

            <h2>Lead List</h2>

            {leads.length === 0 ? (
                <p>No leads found.</p>
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
                            <th>Campaign</th>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Source</th>
                            <th>Requirement</th>
                            <th>Follow-up</th>
                            <th>Sales Owner</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id}>

                                <td>
                                    {lead.campaignId
                                        ? getCampaignName(
                                              lead.campaignId
                                          )
                                        : "-"}
                                </td>

                                <td>
                                    {lead.companyName}
                                </td>

                                <td>
                                    {lead.contactName}
                                </td>

                                <td>
                                    {lead.email}
                                </td>

                                <td>
                                    {lead.phone}
                                </td>

                                <td>
                                    {lead.leadSource}
                                </td>

                                <td>
                                    {lead.requirement}
                                </td>

                                <td>
                                    {lead.followUpDate}
                                </td>

                                <td>
                                    {lead.salesOwner}
                                </td>

                                <td>
                                    ₹
                                    {Number(
                                        lead.opportunityValue ||
                                            0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </td>

                                <td>
                                    {lead.status}
                                </td>

                                <td>
                                    {lead.status ===
                                        "NEW" && (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    lead.id,
                                                    "CONTACTED"
                                                )
                                            }
                                        >
                                            Contacted
                                        </button>
                                    )}

                                    {" "}

                                    {lead.status ===
                                        "CONTACTED" && (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    lead.id,
                                                    "QUALIFIED"
                                                )
                                            }
                                        >
                                            Qualified
                                        </button>
                                    )}

                                    {" "}

                                    {lead.status !==
                                        "CONVERTED" && (
                                        <button
                                            onClick={() =>
                                                convertToClient(
                                                    lead.id
                                                )
                                            }
                                        >
                                            Convert to Client
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Lead;