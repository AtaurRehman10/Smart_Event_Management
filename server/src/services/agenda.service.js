import User from "../models/User.js";
import Session from "../models/Session.js";

function overlap(aStart, aEnd, bStart, bEnd) {
     return aStart < bEnd && bStart < aEnd;
}

export async function generatePersonalizedAgenda({ userId, eventId }) {
     const user = await User.findById(userId).lean();
     if (!user) throw new Error("User not found");

     const sessions = await Session.find({ event: eventId }).sort({ startTime: 1 }).lean();

     // score sessions based on interests/industry
     const scored = sessions.map(s => {
          const textToScan = (s.title + " " + (s.description || "") + " " + (s.track || "")).toLowerCase();

          // Check interests
          const interestHits = (user.interests || []).filter(i =>
               textToScan.includes(i.toLowerCase())
          ).length;

          // Check industry/organization
          // Adapted: user.industry
          const industryBoost =
               user.industry && textToScan.includes(user.industry.toLowerCase())
                    ? 1
                    : 0;

          const score = interestHits * 3 + industryBoost * 1;
          return { ...s, score };
     });

     // choose sessions greedily, avoid conflicts, add travel buffer of 10 mins
     const chosen = [];
     const travelBufferMs = 10 * 60 * 1000;

     for (const s of scored.sort((a, b) => b.score - a.score)) {
          if (s.score <= 0) continue;

          let ok = true;
          for (const c of chosen) {
               const sStart = new Date(s.startTime).getTime();
               const sEnd = new Date(s.endTime).getTime();
               const cStart = new Date(c.startTime).getTime();
               const cEnd = new Date(c.endTime).getTime();

               // add buffer between sessions
               const bufferedStart = sStart - travelBufferMs;
               const bufferedEnd = sEnd + travelBufferMs;

               if (overlap(bufferedStart, bufferedEnd, cStart, cEnd)) {
                    ok = false;
                    break;
               }
          }
          if (ok) chosen.push(s);
     }

     chosen.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

     return {
          user: { _id: user._id, name: user.name, interests: user.interests, industry: user.industry },
          sessions: chosen.map(s => ({
               _id: s._id,
               title: s.title,
               room: s.room,
               startTime: s.startTime,
               endTime: s.endTime,
               reason: "Matched your interests/industry and avoided conflicts (with travel buffer).",
          })),
     };
}
