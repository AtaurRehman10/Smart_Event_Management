import React, { useState } from "react";
import { API_BASE } from "../api/base";

export default function MyAgenda() {
     const userId = localStorage.getItem("userId") || "67a99f7d29623c72b8c9cff7"; // Fallback for dev
     const eventId = localStorage.getItem("eventId") || "67a9a1b829623c72b8c9d00f"; // Fallback for dev
     const [agenda, setAgenda] = useState(null);
     const [loading, setLoading] = useState(false);

     async function generate() {
          setLoading(true);
          try {
               const r = await fetch(`${API_BASE}/agenda/generate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, eventId }),
               });
               const data = await r.json();
               setAgenda(data);
          } catch (e) {
               alert("Error generating agenda: " + e.message);
          } finally {
               setLoading(false);
          }
     }

     return (
          <div style={{ padding: 16 }}>
               <h2>Personalized Agenda</h2>
               <button
                    onClick={generate}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    disabled={loading}
               >
                    {loading ? "Generating..." : "Generate My Agenda"}
               </button>

               {agenda && (
                    <div style={{ marginTop: 16 }}>
                         <h3 className="text-xl font-bold mb-4">Agenda for {agenda.user.name}</h3>
                         {agenda.sessions.map((s) => (
                              <div key={s._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10, borderRadius: 8 }}>
                                   <b className="text-lg">{s.title}</b> <br />
                                   <span className="text-gray-600">Room: {s.room}</span> <br />
                                   <span className="text-sm text-gray-500">
                                        {new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleTimeString()}
                                   </span>
                                   <div style={{ marginTop: 8, fontStyle: 'italic', color: '#666' }}>
                                        <small>{s.reason}</small>
                                   </div>
                              </div>
                         ))}
                         {agenda.sessions.length === 0 && <p>No sessions matched your criteria or schedule.</p>}
                    </div>
               )}
          </div>
     );
}
