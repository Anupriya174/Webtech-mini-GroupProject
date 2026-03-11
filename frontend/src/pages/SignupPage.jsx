import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

  function handleSignup(e) {
        e.preventDefault();
        fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, dob })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Signup successful!") {
                alert("Signup succeeded!");
                navigate("/login");
            } else {
                alert(data.message || "Signup failed!");
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
      <form
        onSubmit={handleSignup}
        style={{
          maxWidth: 400,
          width: "100%",
          background: "#fbf2d8",
          padding: 30,
          borderRadius: 20
        }}>
        <h2 style={{ textAlign: "center" }}>Create new Account</h2>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <small>
            Already Registered?{" "}
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>
              Log in here.
            </span>
          </small>
        </div>
        <input type="text" placeholder="Name" value={name} required onChange={e => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 14, borderRadius: 12, border: "1px solid #aaa" }} />
        <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 14, borderRadius: 12, border: "1px solid #aaa" }} />
        <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 14, borderRadius: 12, border: "1px solid #aaa" }} />
        <input type="date" value={dob} required onChange={e => setDob(e.target.value)}
          style={{ width: "100%", marginBottom: 18, padding: 14, borderRadius: 12, border: "1px solid #aaa" }} />
        <button type="submit"
          style={{
            display: "block",
            margin: "24px auto 0 auto", 
            width: "70%",
            background: "#222",
            color: "#fff",
            fontSize: "1.12em",
            padding: 13,
            borderRadius: 12,
            border: "none",
            cursor: "pointer"
          }}>
          Sign up
        </button>
      </form>
    </div>
  );
}
export default SignupPage;