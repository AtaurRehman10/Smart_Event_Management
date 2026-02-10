import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
     session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
     text: { type: String, required: true },
     askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     upvotes: { type: Number, default: 0 },
     upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     isApproved: { type: Boolean, default: false },
     isAnswered: { type: Boolean, default: false },
     answer: { type: String },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
