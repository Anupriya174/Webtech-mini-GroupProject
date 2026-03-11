
// export default FeedbackPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FeedbackPage() {

  const userEmail = localStorage.getItem("userEmail"); // Logged-in user's email
  const nav = useNavigate();

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const defaultSheets = Array(12).fill().map(() => ({
    action: "",
    worst: "",
    prevent: "",
    repair: "",
    longterm: ""
  }));

  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [sheets, setSheets] = useState(defaultSheets);

  // -------------------------------
  // LOAD FEEDBACK FROM MONGODB
  // -------------------------------
  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/feedback?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length === 12) {
          setSheets(data);
        } else {
          setSheets(defaultSheets);
        }
      })
      .catch(() => {
        setSheets(defaultSheets);
      });
  }, [userEmail]);


  // -------------------------------
  // SAVE FEEDBACK TO MONGODB
  // -------------------------------
  function saveToDB(updatedSheets) {
    fetch("http://localhost:5000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        sheets: updatedSheets,
      }),
    });
  }


  // -------------------------------
  // HANDLE FIELD CHANGES
  // -------------------------------
  const handleChange = (field, value) => {
    setSheets((prev) => {
      const next = [...prev];
      next[activeMonth] = { ...next[activeMonth], [field]: value };

      saveToDB(next);  // Save to MongoDB
      return next;
    });
  };


  return (
    <div style={{ background: "#FFFBEA", minHeight: "100vh", padding: "60px", textAlign: "center" }}>
      
      {/* Back Button */}
      <button
        onClick={() => nav("/dashboard")}
        style={{
          position: "absolute",
          left: 28,
          top: 24,
          padding: "8px 18px",
          borderRadius: 10,
          border: "none",
          background: "#decd9d",
          color: "#232014",
          fontFamily: "Georgia,serif",
          fontSize: "1.08em",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      {/* Month Selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 30 }}>
        {months.map((m, idx) => (
          <button
            key={m}
            style={{
              background: idx === activeMonth ? "#decd9d" : "transparent",
              border: "none",
              color: "#232014",
              cursor: "pointer",
              fontWeight: idx === activeMonth ? "bold" : "500",
              fontSize: "1.1em",
              padding: "7px 15px",
              borderRadius: "9px"
            }}
            onClick={() => setActiveMonth(idx)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Sheet Content */}
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "#faf6de",
        padding: 30,
        borderRadius: 14
      }}>
        
        {/* Action */}
        <div style={{ marginBottom: 26 }}>
          <label style={{ fontWeight: "bold" }}>
            What action do you wish to take?
          </label>
          <textarea
            value={sheets[activeMonth].action}
            onChange={e => handleChange("action", e.target.value)}
            style={{
              width: "100%",
              minHeight: 55,
              borderRadius: 10,
              marginTop: 7,
              padding: 12
            }}
          />
        </div>

        {/* Worst / Prevent / Repair */}
        <div style={{ display: "flex", gap: 19, marginBottom: 24 }}>
          
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold" }}>The worst outcomes</label>
            <textarea
              value={sheets[activeMonth].worst}
              onChange={e => handleChange("worst", e.target.value)}
              style={{
                width: "100%",
                minHeight: 45,
                borderRadius: 9,
                marginTop: 7,
                padding: 10
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold" }}>How to prevent</label>
            <textarea
              value={sheets[activeMonth].prevent}
              onChange={e => handleChange("prevent", e.target.value)}
              style={{
                width: "100%",
                minHeight: 45,
                borderRadius: 9,
                marginTop: 7,
                padding: 10
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold" }}>How to repair</label>
            <textarea
              value={sheets[activeMonth].repair}
              onChange={e => handleChange("repair", e.target.value)}
              style={{
                width: "100%",
                minHeight: 45,
                borderRadius: 9,
                marginTop: 7,
                padding: 10
              }}
            />
          </div>
        </div>

        {/* Long-term */}
        <div>
          <label style={{ fontWeight: "bold" }}>
            What will happen long term if you don’t take this action?
          </label>
          <textarea
            value={sheets[activeMonth].longterm}
            onChange={e => handleChange("longterm", e.target.value)}
            style={{
              width: "100%",
              minHeight: 55,
              borderRadius: 10,
              marginTop: 7,
              padding: 12
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default FeedbackPage;
