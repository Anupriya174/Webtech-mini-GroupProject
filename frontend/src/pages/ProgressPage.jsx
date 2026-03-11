import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProgressPage() {
  const [tasks, setTasks] = useState({
    college: [],
    personal: [],
    home: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    function fetchTasks() {
      fetch(`http://localhost:5000/tasks?email=${email}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(arr => {
          const byCat = { college: [], personal: [], home: [] };
          arr.forEach(t => {
            if (byCat[t.category]) byCat[t.category].push(t);
          });
          setTasks(byCat);
        });
    }
    fetchTasks();
    const interval = setInterval(fetchTasks, 2000); // refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  function pieData(cat) {
    const arr = tasks[cat];
    const total = arr.length;
    const completed = arr.filter(t => t.status === "done").length;
    // In-progress robust logic
    const isInProgress = t =>
      t.status !== "done" && (
        (!!t.inProgress && t.inProgress !== "false" && t.inProgress !== 0 && t.inProgress !== null)
      );
    const inprogress = arr.filter(isInProgress).length;
    const pending = total - completed - inprogress;
    return { completed, inprogress, pending, total };
  }

  function renderPie({ completed, inprogress, pending, total }, colors) {
    if (total === 0) return <div style={{
      width: 150, height: 150, borderRadius: "50%", background: "#eee",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>No data</div>;
    const c = Math.round((completed / total) * 100);
    const i = Math.round((inprogress / total) * 100);

    const pieStyle = {
      background: `conic-gradient(
        ${colors[0]} 0 ${c}%,
        ${colors[1]} ${c}% ${c + i}%,
        ${colors[2]} ${c + i}% 100%)`,
      width: 150, height: 150, borderRadius: "50%"
    };
    return <div style={pieStyle}></div>;
  }

  return (
    <div style={{ background: "#FFFBEA", minHeight: "100vh", textAlign: "center", padding: 40, position: "relative" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          padding: "10px 18px",
          borderRadius: "10px",
          border: "none",
          background: "#cab681",
          color: "#232014",
          fontWeight: 600,
          fontSize: "1.05em",
          cursor: "pointer"
        }}
      >
        ← Back to Dashboard
      </button>
      <h2 style={{ color: "#a18d70", fontWeight: "bold", fontSize: "2em" }}>PROGRESS ANALYSIS</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 50, marginTop: 60 }}>
        <div>
          {renderPie(pieData("college"), ["#7db5e6", "#63c37d", "#ffcb6b"])}
          <div>College</div>
          <div><span style={{ color: "#7db5e6" }}>{pieData("college").completed}</span> completed</div>
          <div><span style={{ color: "#63c37d" }}>{pieData("college").inprogress}</span> in progress</div>
          <div><span style={{ color: "#ffcb6b" }}>{pieData("college").pending}</span> not started</div>
        </div>
        <div>
          {renderPie(pieData("personal"), ["#b0a3e6", "#82ccf2", "#3a57c2"])}
          <div>Personal</div>
          <div><span style={{ color: "#b0a3e6" }}>{pieData("personal").completed}</span> completed</div>
          <div><span style={{ color: "#82ccf2" }}>{pieData("personal").inprogress}</span> in progress</div>
          <div><span style={{ color: "#3a57c2" }}>{pieData("personal").pending}</span> not started</div>
        </div>
        <div>
          {renderPie(pieData("home"), ["#a74d7e", "#f9a4d1", "#e8d7f5"])}
          <div>Home</div>
          <div><span style={{ color: "#a74d7e" }}>{pieData("home").completed}</span> completed</div>
          <div><span style={{ color: "#f9a4d1" }}>{pieData("home").inprogress}</span> in progress</div>
          <div><span style={{ color: "#e8d7f5" }}>{pieData("home").pending}</span> not started</div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
