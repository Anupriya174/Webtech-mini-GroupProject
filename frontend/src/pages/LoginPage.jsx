

// export default LoginPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");

    // 🔥 FIX: Clear old logged-in user whenever login page opens
    useEffect(() => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
    }, []);

    function handleLogin(e) {
        e.preventDefault();

        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) 
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Login successful!") {
                alert("Login succeeded!");

                // Store correct new user info
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.name);

                navigate("/dashboard");
            } else {
                alert(data.message || "Login failed!");
            }
        })
        .catch(() => {
            alert("Network error!");
        });
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#fbf2d8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <form style={{
                maxWidth: 400,
                width: "100%",
                background: "#fbf2d8",
                padding: 32,
                borderRadius: 20
            }} onSubmit={handleLogin}>
                <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Login</h2>
                <div style={{ textAlign: "center" }}>
                    <small>Sign in to continue.</small>
                </div>

                <div style={{ marginTop: 20 }}>
                    <input type="email" placeholder="Email" value={email} required
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: 12,
                            border: "1px solid #444",
                            borderRadius: 8,
                            marginBottom: 18,
                            fontSize: 16
                        }}
                    />
                </div>

                <div style={{ marginBottom: 30 }}>
                    <input type="password" placeholder="Password" value={password} required
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: 12,
                            border: "1px solid #444",
                            borderRadius: 8,
                            fontSize: 16
                        }}
                    />
                </div>

                <button style={{
                    width: "100%",
                    padding: 16,
                    background: "#222",
                    color: "#fff",
                    border: "none",
                    borderRadius: 20,
                    fontSize: 20,
                    fontWeight: "bold"
                }} type="submit">Log in</button>
            </form>
        </div>
    );
}

export default LoginPage;

