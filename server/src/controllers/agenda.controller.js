import { generatePersonalizedAgenda } from "../services/agenda.service.js";

export async function generateAgenda(req, res) {
     try {
          const { userId, eventId } = req.body;
          const data = await generatePersonalizedAgenda({ userId, eventId });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}
