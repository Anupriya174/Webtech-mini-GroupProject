import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const cats = ["college", "personal", "home"];
//Creating Dashboard page as a functional component .
// Uses useNavigate() to get a navigation function (nav).

//Retrieves the username from localStorage or defaults to "You"
 
const DashboardPage = () => {
  const nav = useNavigate();
  const name = localStorage.getItem("username") || "You";

  // Initialize State for today's tasks by category
  const [tasks, setTasks] = useState({
    college: [],
    personal: [],
    home: [],
  });
//Helper function:Return todays date 
  function getTodayISO() {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  // Toggle the 'done' status and update server/UI
  function handleStatusToggle(cat, task) {
  const markingDone = task.status !== "done";
  const newStatus = markingDone ? "done" : "pending";
  const update = markingDone
    ? { status: newStatus, inProgress: false } // If marking done, also clear inProgress
    : { status: newStatus };

  fetch(`http://localhost:5000/tasks/${task._id || task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  })
    .then((res) => {
      if (res.ok) {
        setTasks((prev) => ({
          ...prev,
          [cat]: prev[cat].map((t) =>
            (t._id || t.id) === (task._id || task.id)
              ? { ...t, status: newStatus, ...(markingDone ? { inProgress: false } : {}) }
              : t
          ),
        }));
      }
    });
}


  // Toggle the 'in-progress' radio status and update server/UI
  function handleInProgressToggle(cat, task) {
  let updates = {};
  // If marking inProgress as true AND task is done, set status to 'pending'
  if (!task.inProgress && task.status === "done") {
    updates = { inProgress: true, status: "pending" };
  } else {
    updates = { inProgress: !task.inProgress };
  }
  
  fetch(`http://localhost:5000/tasks/${task._id || task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
    .then((res) => {
      if (res.ok) {
        setTasks((prev) => ({
          ...prev,
          [cat]: prev[cat].map((t) =>
            (t._id || t.id) === (task._id || task.id)
              ? { ...t, ...updates }
              : t
          ),
        }));
      }
    });
}

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const today = getTodayISO();
    fetch(`http://localhost:5000/tasks?email=${email}&date=${today}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((arr) => {
        const byCat = { college: [], personal: [], home: [] };
        arr.forEach((t) => {
          if (byCat[t.category]) byCat[t.category].push(t);
        });
        setTasks(byCat);
      });
  }, []);

  return (
    <div style={{ background: "#faf6de", minHeight: "100vh", padding: "32px 0", position: "relative" }}>
      {/* Welcome box */}
      <div style={{
        background: "rgba(255,255,255,0.45)",
        display: "inline-block",
        marginLeft: 32,
        marginBottom: 22,
        padding: "10px 18px",
        borderRadius: 11
      }}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontSize: "2em",
          fontWeight: 500,
          color: "#232014"
        }}>
          Hey <span style={{ fontStyle: "italic" }}>{name}</span>, Welcome back!{" "}
          <span role="img" aria-label="wave" style={{ fontSize: "1em" }}>👋</span>
        </span>
      </div>
      {/* Progress pie and label - now links to ProgressPage */}
      <button
        onClick={() => nav("/progress")}
        style={{
          position: "absolute", top: 24, right: 42, textAlign: "right", display: "flex",
          alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer",
        }}
        aria-label="Go to Progress"
      >
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.18em" }}>My progress</span>
        <svg width="38" height="38" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="16" stroke="#927354" strokeWidth="5" fill="#c5ac87" />
          <path d="M19 19 L19 3 A16 16 0 0 1 35 19 Z" fill="#fff" stroke="#927354" strokeWidth="2" />
        </svg>
      </button>
      {/* Today's tasks section */}
      <div style={{ marginLeft: 32, marginTop: "22px", fontWeight: 700, fontSize: "2em" }}>Today</div>
      <div style={{ marginTop: 20 }}>
        {cats.map(cat => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{
              marginLeft: 32,
              fontWeight: 600,
              fontFamily: "Georgia, serif",
              color: "#a58960",
              fontSize: "1.10em",
              letterSpacing: 1,
              marginBottom: 6
            }}>
              {cat.toUpperCase()}
            </div>
            {tasks[cat] && tasks[cat].length > 0 ? (
              tasks[cat].map((task, i) => (
                <div key={task._id || task.id || i} style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  border: "none",
                  borderRadius: 12,
                  marginLeft: 32,
                  marginRight:32,
                  marginBottom: 10,
                  minHeight: 38,
                  boxShadow: "none"
                }}>
                  {/* Checkbox for done status */}
                  <input
                    type="checkbox"
                    style={{
                      width: 22,
                      height: 22,
                      marginLeft: 14,
                      marginRight: 18,
                      accentColor: "#a58960"
                    }}
                    checked={task.status === "done"}
                    onChange={() => handleStatusToggle(cat, task)}
                  />
                  {/* Task title */}
                  <input
                    type="text"
                    readOnly
                    value={task.title}
                    style={{
                      width: 92,
                      flex:1,
                      padding: "13px 8px",
                      fontSize: "1rem",
                      borderRadius: 10,
                      border: "none",
                      background: "#fff",
                      overflowWrap: "break-word",    // allow long words to break
                      wordBreak: "break-word",       // force breaking when too long
                      whiteSpace: "normal"
                    }}
                  />
                  {/* In-Progress radio button */}
                  <label style={{ marginRight: 30, display: "flex", alignItems: "center", gap: 3 }}>
                    <input
                      type="checkbox"
                      checked={!!task.inProgress}
                      onChange={() => handleInProgressToggle(cat, task)}
                      style={{ 
                           appearance: "none",
                           height: 18,
                           width: 18,
                           borderRadius: "50%",
                           border: "2px solid #E9A44C",
                           background: !!task.inProgress ? "#F4C965" : "#fff",
                           cursor: "pointer"
                      }}
                    //disabled={task.status === "done"}
                    />
                    <span style={{ fontSize: "0.92em", color: "#3a0e05ff" }}>In Progress</span>
                  </label>
                </div>
              ))
            ) : (
              <div style={{ marginLeft: 38, color: "#8b8071", fontSize: "0.98em" }}>
                No tasks for today.
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Floating calendar, timer, and productivity tracker */}
      <div style={{
        position: "fixed",
        right: 32,
        bottom: 32,
        display: "flex",
        gap: 20,
        zIndex: 999
      }}>
        <button
          onClick={() => nav("/calendar")}
          style={{
            background: "#c5ac87",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            padding: 13,
            boxShadow: "0 2px 7px rgba(0,0,0,0.09)",
            cursor: "pointer",
            width: 55,
            height: 55,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          aria-label="Calendar"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
        <button
          onClick={() => nav("/focustimer")}
          style={{
            background: "#a08454",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            padding: 13,
            boxShadow: "0 2px 7px rgba(0,0,0,0.09)",
            cursor: "pointer",
            width: 55,
            height: 55,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          aria-label="Focus Timer"
        >
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" stroke="#fff" strokeWidth="2" fill="#a08454" />
            <line x1="14" y1="14" x2="14" y2="7" stroke="#fff" strokeWidth="2" />
            <line x1="14" y1="14" x2="21" y2="14" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
        {/* Productivity Tracker Button */}
        <button
          onClick={() => nav("/feedback")}
          aria-label="Productivity Tracker"
          style={{
            background: "#7b6c4c",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            padding: 13,
            boxShadow: "0 2px 7px rgba(0,0,0,0.09)",
            cursor: "pointer",
            width: 55,
            height: 55,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <span style={{ fontSize: "1.8em" }}>📋</span>
        </button>
      </div>
    </div>
  );
};
export default DashboardPage;

