import React, { useEffect, useState } from "react";
import { API_BASE } from "../../api/base";
import NetworkGraph from "../../components/NetworkGraph";

export default function Networking() {
     // Replace these with your real logged-in user + selected event
     const userId = localStorage.getItem("userId") || "67a99f7d29623c72b8c9cff7";
     const eventId = localStorage.getItem("eventId") || "67a9a1b829623c72b8c9d00f";

     const [matches, setMatches] = useState([]);
     const [graph, setGraph] = useState(null);

     useEffect(() => {
          if (!userId || !eventId) return;

          fetch(`${API_BASE}/matching/matches?userId=${userId}&eventId=${eventId}`)
               .then(r => r.json())
               .then(setMatches)
               .catch(e => console.error(e));

          fetch(`${API_BASE}/matching/graph?userId=${userId}&eventId=${eventId}`)
               .then(r => r.json())
               .then(setGraph)
               .catch(e => console.error(e));
     }, [userId, eventId]);

     return (
          <div style={{ padding: 16 }}>
               <h2 className="text-2xl font-bold mb-6">AI Networking — People You Should Meet</h2>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                         {matches.map((m) => (
                              <div key={m.user._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10, borderRadius: 8 }}>
                                   <div className="flex justify-between items-start">
                                        <div>
                                             <b className="text-lg">{m.user.name}</b>
                                             <div className="text-sm text-gray-600">{m.user.company || "N/A"}</div>
                                        </div>
                                        <div className="text-right">
                                             <div className="text-blue-600 font-bold">{m.score.toFixed(0)}% Match</div>
                                             <small className="text-gray-500">Shared bookmarks: {m.sharedBookmarks}</small>
                                        </div>
                                   </div>

                                   <div style={{ marginTop: 8 }}>
                                        <b className="text-sm text-gray-700">Conversation starters:</b>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                                             {m.starters.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                   </div>
                              </div>
                         ))}
                         {matches.length === 0 && <p>No matches found yet.</p>}
                    </div>

                    <div>
                         <h3 className="text-xl font-bold mb-4">Network Graph</h3>
                         {graph ? <NetworkGraph graph={graph} /> : "Loading graph..."}
                    </div>
               </div>
          </div>
     );
}
