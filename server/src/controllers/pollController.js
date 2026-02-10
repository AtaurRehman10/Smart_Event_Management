import Poll from '../models/Poll.js';
import Question from '../models/Question.js';

// POST /api/polls
export const createPoll = async (req, res, next) => {
     try {
          const poll = await Poll.create({ ...req.body, createdBy: req.user._id });
          res.status(201).json({ success: true, poll });
     } catch (error) {
          next(error);
     }
};

// GET /api/polls/session/:sessionId
export const getPollsBySession = async (req, res, next) => {
     try {
          const polls = await Poll.find({ session: req.params.sessionId }).sort({ createdAt: -1 });
          res.json({ success: true, polls });
     } catch (error) {
          next(error);
     }
};

// POST /api/polls/:id/vote
export const votePoll = async (req, res, next) => {
     try {
          const { optionIndex } = req.body;
          const poll = await Poll.findById(req.params.id);
          if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

          // Check if user already voted
          const alreadyVoted = poll.options.some(o => o.voters.includes(req.user._id));
          if (alreadyVoted) return res.status(400).json({ success: false, message: 'Already voted' });

          poll.options[optionIndex].votes += 1;
          poll.options[optionIndex].voters.push(req.user._id);
          await poll.save();

          res.json({ success: true, poll });
     } catch (error) {
          next(error);
     }
};

// POST /api/polls/questions
export const createQuestion = async (req, res, next) => {
     try {
          const question = await Question.create({ ...req.body, askedBy: req.user._id });
          await question.populate('askedBy', 'name');
          res.status(201).json({ success: true, question });
     } catch (error) {
          next(error);
     }
};

// GET /api/polls/questions/session/:sessionId
export const getQuestionsBySession = async (req, res, next) => {
     try {
          const questions = await Question.find({ session: req.params.sessionId })
               .populate('askedBy', 'name')
               .sort({ upvotes: -1, createdAt: -1 });
          res.json({ success: true, questions });
     } catch (error) {
          next(error);
     }
};

// POST /api/polls/questions/:id/upvote
export const upvoteQuestion = async (req, res, next) => {
     try {
          const question = await Question.findById(req.params.id);
          if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

          if (question.upvoters.includes(req.user._id)) {
               question.upvoters = question.upvoters.filter(u => u.toString() !== req.user._id.toString());
               question.upvotes -= 1;
          } else {
               question.upvoters.push(req.user._id);
               question.upvotes += 1;
          }

          await question.save();
          res.json({ success: true, question });
     } catch (error) {
          next(error);
     }
};

// PATCH /api/polls/questions/:id/approve
export const approveQuestion = async (req, res, next) => {
     try {
          const question = await Question.findByIdAndUpdate(
               req.params.id,
               { isApproved: req.body.isApproved },
               { new: true }
          );
          res.json({ success: true, question });
     } catch (error) {
          next(error);
     }
};
