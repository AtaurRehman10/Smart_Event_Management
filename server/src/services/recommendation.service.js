import Session from "../models/Session.js";
import Bookmark from "../models/Bookmark.js";
import Attendance from "../models/Attendance.js";

export async function getTrendingSessions({ eventId, limit = 6 }) {
     // trending = bookmarks + attendance
     // Note: eventId might be passed as string or ObjectId. 
     // If Session.event is Ref, query should handle it.

     const sessions = await Session.find({ event: eventId }).lean(); // Adapted: eventId -> event

     const results = [];
     for (const s of sessions) {
          // In Bookmark/Attendance, field is eventId (from my new models) or event (if i matched session schema pattern)
          // My new models (Bookmark/Attendance) use eventId.

          const bookmarksCount = await Bookmark.countDocuments({ eventId, sessionId: s._id });
          const attendanceCount = await Attendance.countDocuments({ eventId, sessionId: s._id });
          const engagementScore = bookmarksCount * 2 + attendanceCount * 1;

          results.push({ ...s, bookmarksCount, attendanceCount, engagementScore });
     }

     results.sort((a, b) => b.engagementScore - a.engagementScore);
     return results.slice(0, limit);
}

export async function getSessionRecommendations({ eventId, userId, limit = 6 }) {
     // “Attendees who bookmarked this also bookmarked...”
     const myBookmarks = await Bookmark.find({ eventId, userId }).lean();
     const mySessionIds = myBookmarks.map(b => String(b.sessionId));

     if (mySessionIds.length === 0) {
          // fallback: trending
          return getTrendingSessions({ eventId, limit });
     }

     // find other users who bookmarked my sessions
     const others = await Bookmark.find({
          eventId,
          sessionId: { $in: mySessionIds },
          userId: { $ne: userId }
     }).lean();

     const otherUserIds = [...new Set(others.map(x => String(x.userId)))];

     // sessions those users bookmarked
     const coBookmarks = await Bookmark.find({
          eventId,
          userId: { $in: otherUserIds }
     }).lean();

     // count session frequency
     const freq = new Map();
     for (const b of coBookmarks) {
          const sid = String(b.sessionId);
          if (mySessionIds.includes(sid)) continue; // don’t recommend what already bookmarked
          freq.set(sid, (freq.get(sid) || 0) + 1);
     }

     const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
     const sessionDocs = await Session.find({ _id: { $in: sorted.map(x => x[0]) } }).lean();

     const byId = new Map(sessionDocs.map(s => [String(s._id), s]));
     return sorted.map(([sid, score]) => {
          const s = byId.get(sid);
          // Ensure we don't return null if session not found
          return s ? { ...s, score } : null;
     }).filter(Boolean);
}
