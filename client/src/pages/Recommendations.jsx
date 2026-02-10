import React, { useEffect, useState } from "react";
import { API_BASE } from "../api/base";

export default function Recommendations() {
     const userId = localStorage.getItem("userId") || "67a99f7d29623c72b8c9cff7";
     const eventId = localStorage.getItem("eventId") || "67a9a1b829623c72b8c9d00f";

     const [trending, setTrending] = useState([]);
     const [recommended, setRecommended] = useState([]);

     useEffect(() => {
          if (!eventId) return;

          fetch(`${API_BASE}/recommendations/trending?eventId=${eventId}`)
               .then(r => r.json())
               .then(setTrending)
               .catch(e => console.error(e));

          fetch(`${API_BASE}/recommendations/sessions?eventId=${eventId}&userId=${userId}`)
               .then(r => r.json())
               .then(setRecommended)
               .catch(e => console.error(e));
     }, [eventId, userId]);

     return (
          <div style={{ padding: 16 }}>
               <h2 className="text-2xl font-bold mb-6">Session Recommendations</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                         <h3 className="text-xl font-semibold mb-4 text-indigo-600">Trending Sessions</h3>
                         {trending.map(s => (
                              <div key={s._id} className="border p-4 mb-4 rounded shadow-sm hover:shadow-md transition">
                                   <b className="text-lg">{s.title}</b>
                                   <div className="text-sm text-gray-600 mt-1">Score: {s.engagementScore}</div>
                              </div>
                         ))}
                         {trending.length === 0 && <p>No trending sessions yet.</p>}
                    </div>

                    <div>
                         <h3 className="text-xl font-semibold mb-4 text-purple-600">Recommended For You</h3>
                         {recommended.map(s => (
                              <div key={s._id} className="border p-4 mb-4 rounded shadow-sm hover:shadow-md transition">
                                   <b className="text-lg">{s.title}</b>
                                   {s.score ? <div className="text-sm text-gray-600 mt-1">Co-like score: {s.score}</div> : null}
                              </div>
                         ))}
                         {recommended.length === 0 && <p>No personalized recommendations yet.</p>}
                    </div>
               </div>
          </div>
     );
}
