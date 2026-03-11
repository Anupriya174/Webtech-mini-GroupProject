import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function FocusTimerPage() {
  const nav = useNavigate(), INIT = 1500;
  const [time, setTime] = useState(INIT), [run, setRun] = useState(false);
  const ref = useRef();
  const start = () => {
    if (run) return;
    setRun(true);
    ref.current = setInterval(() => setTime(t =>
      t <= 0 ? (clearInterval(ref.current), setRun(false), alert("Time's up!"), 0) : t - 1
    ), 1000);
  };
  const stop = () => { clearInterval(ref.current); setRun(false); };
  const reset = () => { clearInterval(ref.current); setTime(INIT); setRun(false); };
  const min = Math.floor(time / 60), sec = time % 60;

  const btn = val => ({
    background: "#545453", color: "#fff", fontWeight: "bold", fontSize: "1.1em",
    padding: "9px 0", minWidth: 110, border: "none", borderRadius: 12, margin: "0 7px",
    cursor: val ? "not-allowed" : "pointer"
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#f9f5e0", display: "flex",
      flexDirection: "column", alignItems: "center", position: "relative"
    }}>
      <button onClick={() => nav("/dashboard")}
        style={{
          position: "absolute", top: 28, left: 30, padding: "8px 18px",
          background: "#a08454", color: "#fff", border: "none", borderRadius: "7px",
          fontWeight: "bold", fontSize: "1em", cursor: "pointer"
        }}>← Back</button>
      <h1 style={{
        marginTop: 42, marginBottom: 48, color: "#ae8442",
        fontFamily: "Georgia,serif", fontWeight: "normal", fontSize: "2.7em"
      }}>focus timer</h1>
      <div style={{
        background: "#545453", borderRadius: "50%", width: 350, height: 350,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        margin: "25px auto 32px auto", color: "#fff", fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ fontSize: "2.3em", letterSpacing: "2px", display: "flex", alignItems: "center" }}>
          <span>{min.toString().padStart(2, "0")}</span>
          <span style={{ margin: "0 10px", fontSize: "1em" }}>: </span>
          <span>{sec.toString().padStart(2, "0")}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: "1.3em", display: "flex", justifyContent: "center", gap: 38 }}>
          <span>minutes</span>
          <span>seconds</span>
        </div>
      </div>
      <div>
        <button disabled={run} onClick={start} style={btn(run)}>Start</button>
        <button disabled={!run} onClick={stop} style={btn(!run)}>Stop</button>
        <button onClick={reset} style={btn(false)}>Reset</button>
      </div>
    </div>
  );
}
