import React from "react";
import logo from "../assets/Screenshot.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      background: "#fbf2d8",//background
      minHeight: "100vh",
      padding: "48px 0"
    }}>
      <h1 style={{
        color: "#7e3f90",
        marginTop: "20px",
        textAlign: "center",// heading
        fontWeight: "bold",
        fontSize: "2.2em"
      }}>
        To Do List and Productivity Tracker
      </h1>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",//logo
        marginTop: "48px"
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "450px",
            marginBottom: "48px",
            background: "#fffbea"    // Any PNG empty space blends in!
          }}
        />
        <button
          onClick={() => navigate("/signup")}
          style={{
            background: "#7e3f90",
            color: "#fff",
            fontSize: "1.4em",
            borderRadius: "40px",
            padding: "26px 125px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "18px"
          }}
        >
          Let's Start →
        </button>
      </div>
    </div>
  );
}

export default LandingPage;