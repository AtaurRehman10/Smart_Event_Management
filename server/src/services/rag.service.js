import ChatDoc from "../models/ChatDoc.js";
import Session from "../models/Session.js";
import Event from "../models/Event.js";
import { cosineSimilarity } from "./similarity.util.js";
import { pipeline } from "@xenova/transformers";

let embedder = null;
let generator = null;

async function loadModelsOnce() {
     if (!embedder) {
          embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
     }
     if (!generator) {
          generator = await pipeline("text2text-generation", "Xenova/flan-t5-small");
     }
}

async function embedText(text) {
     await loadModelsOnce();
     const out = await embedder(text, { pooling: "mean", normalize: true });
     return Array.from(out.data);
}

export async function indexEventDocs(eventId) {
     // Create docs from sessions + event basics
     const event = await Event.findById(eventId).lean();
     const sessions = await Session.find({ event: eventId }).lean(); // Adapted: eventId -> event

     const docs = [];

     if (event) {
          // Adapted: event.venueName -> event.location?.name
          const venueName = event.location?.name || "N/A";
          docs.push({
               eventId,
               sourceType: "venue",
               title: "Event Info",
               text: `Event name: ${event.title}. Venue: ${venueName}. Dates: ${event.startDate} to ${event.endDate}.`, // Adapted: event.name -> event.title
          });
     }

     for (const s of sessions) {
          // Adapted: s.speaker (might be ID) -> s.speakerName (String)
          const speakerName = s.speakerName || "N/A";
          docs.push({
               eventId,
               sourceType: "session",
               title: s.title,
               text: `Session: ${s.title}. Speaker: ${speakerName}. Track: ${s.track || "N/A"}. Room: ${s.room || "N/A"}. Time: ${s.startTime} to ${s.endTime}. Description: ${s.description || ""}`,
          });
     }

     // Upsert docs (simple: wipe and reinsert for hackathon)
     await ChatDoc.deleteMany({ eventId });
     for (const d of docs) {
          const embedding = await embedText(d.text);
          await ChatDoc.create({ ...d, embedding });
     }

     return { indexed: docs.length };
}

export async function askChatbot({ eventId, message, history = [] }) {
     await loadModelsOnce();

     const qEmb = await embedText(message);
     const docs = await ChatDoc.find({ eventId }).lean();

     // retrieve top K docs
     const scored = docs
          .map(d => ({ d, sim: cosineSimilarity(qEmb, d.embedding) }))
          .sort((a, b) => b.sim - a.sim)
          .slice(0, 4);

     const context = scored.map(x => `- ${x.d.text}`).join("\n");

     // prompt (RAG)
     const prompt = `
You are an event assistant. Answer using ONLY the context below.
If the answer is not in the context, say: "I don't have that information in the event data."

CONTEXT:
${context}

QUESTION: ${message}

ANSWER:
`.trim();

     const gen = await generator(prompt, { max_new_tokens: 120 });
     const answer = gen?.[0]?.generated_text || "Sorry, I couldn't generate an answer.";

     return {
          answer,
          sources: scored.map(x => ({
               title: x.d.title,
               sourceType: x.d.sourceType,
               similarity: Number(x.sim.toFixed(3)),
          })),
     };
}
