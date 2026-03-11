import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const catOpts = ["college", "personal", "home"];

export default function AddTaskPage() {
  const [task, setTask] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cat, setCat] = useState(catOpts[2]);
  const [showMenu, setShowMenu] = useState(false);
  const nav = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const handler = e => ref.current && !ref.current.contains(e.target) && setShowMenu(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 function submit(e) {
  e.preventDefault();

  // Helper: format a date to YYYY-MM-DD
  function formatDate(d) {
    const pad = n => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const startDate = new Date(start);
  const endDateObj = new Date(end);

  // Build an array of all dates between start and end (inclusive)
  let dates = [];
  for (let d = new Date(startDate); d <= endDateObj; d.setDate(d.getDate() + 1)) {
    dates.push(formatDate(d));
  }

  // For each date, send a POST call
  Promise.all(
    dates.map(date =>
      fetch(`http://localhost:5000/tasks/${cat}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task,
          startDate: date,
          endDate: date,
          category: cat,
          userEmail: localStorage.getItem("userEmail"),
          status: "pending"
        })
      })
    )
  ).then(() => {
    // After all POSTs, navigate to calendar for the start date
    const onlyDate = start.includes("T") ? start.split("T")[0] : start;
    nav("/calendar", { state: { selectedDate: onlyDate } });
  });
}


  return (
    <form onSubmit={submit} style={{
      background: "#fbf2d8", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      <button type="button" onClick={() => nav("/calendar")} style={{ margin: "30px 0 0 38px", background: "none", color: "#a08454", border: "none", fontWeight: "bold", fontSize: "2em", alignSelf: "flex-start" }}>
        <span style={{ fontSize: "1em", marginRight: 8 }}>←</span><span style={{ fontSize: "0.7em" }}>Back</span>
      </button>
      <input value={task} onChange={e => setTask(e.target.value)} placeholder="Write a task..." required style={{
        width: "96%", margin: "42px 0 32px 0", fontSize: "1.2em", padding: "19px 21px", borderRadius: "14px", border: "none", background: "#fff", fontFamily: "Georgia,serif", color: "#968b7c"
      }} />
      <div style={{ display: "flex", gap: "46px", marginBottom: "56px" }}>
        {["Start date", "End date"].map((lbl, i) => (
          <div key={lbl} style={{
            background: "#d2c2a2", borderRadius: "18px", width: "265px", padding: "18px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <div style={{
              fontSize: "1.6em", fontWeight: 600, color: "#6f644f", marginBottom: 12, fontFamily: "Georgia, serif"
            }}>{lbl}</div>
            <input type="date" value={i === 0 ? start : end} onChange={e => (i === 0 ? setStart(e.target.value) : setEnd(e.target.value))} required style={{
              width: "80%", padding: "13px", fontSize: "1.08em", borderRadius: "8px", border: "none", background: "#f6f1e2", marginBottom: 16, textAlign: "center"
            }} />
            <div style={{
              width: "80%", display: "flex", justifyContent: "space-between", marginBottom: 16, color: "#847964", fontSize: "1.1em"
            }}>
              <span>Cancel</span><span>OK</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 48, marginTop: 8 }}>
        <div style={{ position: "relative" }} ref={ref}>
          <button type="submit" style={{
            background: "#38332c", color: "#fff", border: "none", borderRadius: "20px", fontSize: "1.5em", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.11)", minWidth: "175px", padding: "20px 30px", display: "flex", alignItems: "center", gap: 16
          }}>
            <span style={{ fontWeight: 900, fontSize: "0.7em", marginRight: "6px" }}>Add</span>
            <span tabIndex={0} style={{ cursor: "pointer", marginLeft: 4 }} onClick={e => { e.preventDefault(); setShowMenu(!showMenu); }}>
              <span style={{ fontSize: "0.6em", color: "#fff" }}>▼</span>
            </span>
          </button>
          {showMenu && (
            <div style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)", top: "56px", background: "#fffbe8", border: "1.5px solid #dbc89b", borderRadius: 9, minWidth: 105, zIndex: 20, padding: "7px 0"
            }}>
              {catOpts.map(opt => (
                <div key={opt} onClick={() => { setCat(opt); setShowMenu(false); }} style={{
                  color: "#736441", padding: "8px 14px", fontWeight: cat === opt ? 700 : 400, cursor: "pointer", background: cat === opt ? "#f2ebd1" : "transparent"
                }}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
