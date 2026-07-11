import { useState } from "react";
import api from "../services/api";

export default function CreateTicket() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  const createTicket = async () => {

    if (!text.trim()) {
      alert("Please describe your issue.");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post("/tickets/create", {
        text: text
      });

      setTicket(res.data);

    } catch (err) {
      console.log(err);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >

        <h1>🤖 AI Ticket Assistant</h1>

        <p>
          Describe your issue and AI will create a support ticket.
        </p>

        <textarea
          rows="8"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: Unable to login after password reset..."
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            marginTop: "20px",
            borderRadius: "10px"
          }}
        />

        <br /><br />

        <button
          onClick={createTicket}
          style={{
            padding: "14px 30px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? "Analyzing..." : "Create Ticket"}
        </button>

        {ticket && (

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#eef6ff",
              borderRadius: "12px"
            }}
          >

            <h2>✅ Ticket Created</h2>

            <p><b>ID:</b> {ticket.id}</p>
            <p><b>Summary:</b> {ticket.summary}</p>
            <p><b>Priority:</b> {ticket.priority}</p>
            <p><b>Category:</b> {ticket.category}</p>
            <p><b>Department:</b> {ticket.department}</p>
            <p><b>Assigned To:</b> {ticket.assigned_to}</p>
            <p><b>Resolution:</b> {ticket.resolution}</p>
            <p><b>Status:</b> {ticket.status}</p>

          </div>

        )}

      </div>
    </div>
  );
}