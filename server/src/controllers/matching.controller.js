import { getAttendeeMatches, buildNetworkGraph } from "../services/matching.service.js";

export async function matches(req, res) {
     try {
          const { userId, eventId } = req.query;
          const data = await getAttendeeMatches({ userId, eventId });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}

export async function graph(req, res) {
     try {
          const { userId, eventId } = req.query;
          const data = await buildNetworkGraph({ userId, eventId });
          res.json(data);
     } catch (e) {
          res.status(500).json({ message: e.message });
     }
}
