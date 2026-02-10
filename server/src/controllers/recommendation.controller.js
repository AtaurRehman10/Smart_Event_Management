import { getTrendingSessions, getSessionRecommendations } from "../services/recommendation.service.js";

export async function trending(req, res) {
     try {
          const { eventId } = req.query;
          const data = await getTrendingSessions({ eventId });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}

export async function recommendedSessions(req, res) {
     try {
          const { eventId, userId } = req.query;
          const data = await getSessionRecommendations({ eventId, userId });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}
