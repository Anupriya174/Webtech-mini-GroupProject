
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function getDatesArray(n = 14) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      label: `${d.toLocaleString("en-US", { weekday: "short" })} ${d.getDate()}`
    };
  });
}

// NEW: Needs setTasks for deletion
function TaskSection({ title, tasks = [], setTasks }) {

  function handleDeleteTask(id) {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setTasks(prev => ({
          ...prev,
          [title.toLowerCase()]: prev[title.toLowerCase()].filter(task => (task._id || task.id) !== id)
        }));
      })
      .catch(() => alert("Failed to delete task."));
  }

  return (
    <div style={{ marginTop: "26px" }}>
      <div style={{ fontWeight: 700, color: "#cab681", letterSpacing: "1px" }}>{title}</div>
      {tasks.length === 0 ? (
        <div style={{ marginBottom: "12px" }}>No tasks available.</div>
      ) : (
        tasks.map((task, i) => (
          <div key={task._id || i} style={{ marginBottom: 9, display: "flex", alignItems: "center" }}>
            <input type="checkbox" checked={task.status === "done"} readOnly style={{ marginRight: 13, accentColor: "#cab681" }} />
            <input type="text" readOnly value={task.title} style={{ width: "88%", background: "#fff", border: "none", borderRadius: 7, padding: "10px 12px", fontSize: "1.08em" }} />
            <button
              style={{ marginLeft: "14px", background: "#d9534f", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer" }}
              onClick={() => handleDeleteTask(task._id || task.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const datesArr = getDatesArray();
  // Use state from navigation to set the initial selected date
  const initial = location.state?.selectedDate || datesArr[0].iso;
  const [selected, setSelected] = useState(initial);
  const [tasks, setTasks] = useState({ college: [], personal: [], home: [] });

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    fetch(`http://localhost:5000/tasks?email=${email}&date=${selected}`)
      .then(res => res.ok ? res.json() : [])
      .then(arr => {
        const byCat = { college: [], personal: [], home: [] };
        arr.forEach(t => { if (byCat[t.category]) byCat[t.category].push(t); });
        setTasks(byCat);
      });
  }, [selected]);

  return (
    <div style={{ background: "#fbf6df", minHeight: "100vh", padding: 32 }}>
      <button style={{ border: "none", background: "none", fontSize: 28, position: "absolute", left: 20, top: 10, cursor: "pointer", color: "#a08960" }} aria-label="Back to Dashboard" onClick={() => navigate("/dashboard")}>&#8592;</button>
      <div style={{ fontWeight: 700, fontSize: "2.1em", marginBottom: 13, color: "#58513e" }}>CALENDAR</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {datesArr.map(({ iso, label }) => (
          <button key={iso} style={{
            background: iso === selected ? "#d4c2a1" : "#f5eed7",
            fontWeight: iso === selected ? "bold" : "normal",
            border: iso === selected ? "none" : "1.5px solid #e2dabb",
            borderRadius: 9, padding: "8px 18px", fontSize: "1em", color: "#534a34", cursor: "pointer"
          }}
            onClick={() => setSelected(iso)}>
            {label}
          </button>
        ))}
      </div>
      <TaskSection title="COLLEGE" tasks={tasks.college} setTasks={setTasks} />
      <TaskSection title="PERSONAL" tasks={tasks.personal} setTasks={setTasks} />
      <TaskSection title="HOME" tasks={tasks.home} setTasks={setTasks} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <button style={{
          background: "#b5a686", color: "#fff", border: "none", padding: "20px 68px",
          fontSize: "1.3em", fontWeight: 600, borderRadius: 9, marginTop: 18
        }} onClick={() => navigate("/addtaskpage")}>ADD A TASK</button>
      </div>
    </div>
  );
}
