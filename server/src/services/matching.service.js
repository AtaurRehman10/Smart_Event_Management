import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import { jaccardSimilarity } from "./similarity.util.js";

function buildConversationStarters(me, other) {
     const sharedInterests = (me.interests || []).filter(i => (other.interests || []).includes(i));
     const sharedGoals = (me.goals || []).filter(g => (other.goals || []).includes(g));

     const starters = [];
     if (sharedInterests.length) starters.push(`You both like: ${sharedInterests.slice(0, 3).join(", ")}`);
     if (sharedGoals.length) starters.push(`Shared goals: ${sharedGoals.slice(0, 2).join(", ")}`);
     if (me.industry && other.industry && me.industry === other.industry) starters.push(`Both are in ${me.industry}.`);

     starters.push("Ask: What’s the best session you attended so far?");
     starters.push("Ask: What are you hoping to learn or achieve at this event?");
     return starters;
}

export async function getAttendeeMatches({ userId, eventId, limit = 8 }) {
     const me = await User.findById(userId).lean();
     if (!me) throw new Error("User not found");

     const others = await User.find({ _id: { $ne: userId } }).lean();

     // Collaborative data: which sessions I bookmarked
     const myBookmarks = await Bookmark.find({ userId, eventId }).lean();
     const mySessionIds = new Set(myBookmarks.map(b => String(b.sessionId)));

     // For collaborative filtering: count co-bookmarks with each user
     const otherBookmarks = await Bookmark.find({ eventId }).lean();
     const bookmarksByUser = new Map();
     for (const b of otherBookmarks) {
          const uid = String(b.userId);
          if (!bookmarksByUser.has(uid)) bookmarksByUser.set(uid, []);
          bookmarksByUser.get(uid).push(String(b.sessionId));
     }

     const scored = others.map((u) => {
          // Profile similarity
          const interestSim = jaccardSimilarity(me.interests, u.interests);
          const goalSim = jaccardSimilarity(me.goals, u.goals);
          const industrySim = (me.industry && u.industry && me.industry === u.industry) ? 1 : 0;

          // Collaborative filtering: how many same sessions bookmarked
          const uSessions = new Set(bookmarksByUser.get(String(u._id)) || []);
          let sharedBookmarks = 0;
          for (const sid of uSessions) if (mySessionIds.has(sid)) sharedBookmarks++;

          // Final score (tweakable)
          const score =
               interestSim * 5 +
               goalSim * 3 +
               industrySim * 2 +
               Math.min(sharedBookmarks, 5) * 1.5;

          return {
               user: {
                    _id: u._id,
                    name: u.name,
                    company: u.organization, // Adapted to schema: company -> organization
                    industry: u.industry,
                    interests: u.interests,
                    goals: u.goals,
               },
               score,
               sharedBookmarks,
               starters: buildConversationStarters(me, u),
          };
     });

     scored.sort((a, b) => b.score - a.score);
     return scored.slice(0, limit);
}

export async function buildNetworkGraph({ userId, eventId, topN = 25 }) {
     const me = await User.findById(userId).lean();
     const users = await User.find({}).limit(topN).lean();

     const nodes = users.map(u => ({
          id: String(u._id),
          name: u.name,
          company: u.organization || "", // Adapted to schema
          industry: u.industry || "",
     }));

     const links = [];
     for (let i = 0; i < users.length; i++) {
          for (let j = i + 1; j < users.length; j++) {
               const a = users[i], b = users[j];
               const sim = jaccardSimilarity(a.interests, b.interests) * 0.7 +
                    jaccardSimilarity(a.goals, b.goals) * 0.3 +
                    ((a.industry && b.industry && a.industry === b.industry) ? 0.2 : 0);

               if (sim > 0.35) {
                    links.push({
                         source: String(a._id),
                         target: String(b._id),
                         value: Number(sim.toFixed(2)),
                    });
               }
          }
     }

     return { me: String(me?._id || ""), nodes, links };
}
