import React, { useState } from "react";
import { API_BASE } from "../api/base";

export default function Chatbot() {
     const eventId = localStorage.getItem("eventId") || "67a9a1b829623c72b8c9d00f"; // Fallback for dev
     const [message, setMessage] = useState("");
     const [chat, setChat] = useState([]);
     const [sources, setSources] = useState([]);

     async function handleIndex() {
          try {
               const r = await fetch(`${API_BASE}/chatbot/index`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventId }),
               });
               const data = await r.json();
               alert(`Indexed docs: ${data.indexed}`);
          } catch (e) {
               alert("Error indexing: " + e.message);
          }
     }

     async function send() {
          const userMsg = message.trim();
          if (!userMsg) return;

          setChat(prev => [...prev, { role: "user", text: userMsg }]);
          setMessage("");

          try {
               const r = await fetch(`${API_BASE}/chatbot/ask`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventId, message: userMsg, history: chat }),
               });
               const data = await r.json();

               setChat(prev => [...prev, { role: "assistant", text: data.answer }]);
               setSources(data.sources || []);
          } catch (e) {
               setChat(prev => [...prev, { role: "assistant", text: "Error: " + e.message }]);
          }
     }

     return (
          <div style={{ padding: 16 }}>
               <h2>Event Chatbot (RAG)</h2>

               <button onClick={handleIndex} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Index Event Data (do once)</button>

               <div style={{ border: "1px solid #ddd", padding: 12, height: 350, overflow: "auto", marginTop: 12, borderRadius: 8 }}>
                    {chat.map((c, i) => (
                         <div key={i} style={{ marginBottom: 8, textAlign: c.role === 'user' ? 'right' : 'left' }}>
                              <span style={{
                                   background: c.role === 'user' ? '#e6f7ff' : '#f0f0f0',
                                   padding: '8px 12px',
                                   borderRadius: 12,
                                   display: 'inline-block'
                              }}>
                                   <b>{c.role === 'user' ? 'You' : 'AI'}:</b> {c.text}
                              </span>
                         </div>
                    ))}
               </div>

               <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <input
                         style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder='Ask: "Where is the AI keynote?"'
                         onKeyPress={(e) => e.key === 'Enter' && send()}
                    />
                    <button onClick={send} className="bg-green-500 text-white px-6 py-2 rounded">Send</button>
               </div>

               {sources.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                         <b>Sources used:</b>
                         <ul className="list-disc pl-5">
                              {sources.map((s, i) => (
                                   <li key={i}>{s.title} ({s.sourceType}) — sim {s.similarity}</li>
                              ))}
                         </ul>
                    </div>
               )}
          </div>
     );
}
