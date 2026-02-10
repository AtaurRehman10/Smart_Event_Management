import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
     session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
     question: { type: String, required: true },
     options: [{
          text: { type: String, required: true },
          votes: { type: Number, default: 0 },
          voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     }],
     isActive: { type: Boolean, default: true },
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Poll', pollSchema);
