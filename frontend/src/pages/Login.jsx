import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!username || !password) {
            setError("Please enter username and password");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8081/api/login",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(response.data)
            );

            onLogin(response.data);

        } catch (err) {
            if (err.response) {
                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Invalid username or password"
                );
            } else {
                setError("Cannot connect to backend");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8"
            }}
        >

            <div
                style={{
                    width: "380px",
                    padding: "35px",
                    background: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}
            >

                {/* Logo / Title */}

                <h1
                    style={{
                        textAlign: "center",
                        color: "#1e3a8a",
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "10px"
                    }}
                >
                    PriyoniX ERP
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#555555",
                        fontSize: "16px",
                        marginBottom: "30px"
                    }}
                >
                    Integrated Business ERP
                </p>

                {/* Login Form */}

                <form onSubmit={handleLogin}>

                    {/* Username */}

                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#555"
                        }}
                    >
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "18px",
                            boxSizing: "border-box",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "14px"
                        }}
                    />

                    {/* Password */}

                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            color: "#555"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "18px",
                            boxSizing: "border-box",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "14px"
                        }}
                    />

                    {/* Error */}

                    {error && (
                        <div
                            style={{
                                color: "#dc2626",
                                background: "#fee2e2",
                                padding: "10px",
                                borderRadius: "5px",
                                marginBottom: "12px",
                                textAlign: "center"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Footer */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        fontSize: "13px",
                        color: "#888"
                    }}
                >
                    PriyoniX Integrated Business ERP
                </p>

            </div>

        </div>
    );
}

export default Login;