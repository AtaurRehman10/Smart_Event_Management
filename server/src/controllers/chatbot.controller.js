import { askChatbot, indexEventDocs } from "../services/rag.service.js";

export async function indexDocs(req, res) {
     try {
          const { eventId } = req.body;
          const data = await indexEventDocs(eventId);
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}

export async function ask(req, res) {
     try {
          const { eventId, message, history } = req.body;
          const data = await askChatbot({ eventId, message, history });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}
