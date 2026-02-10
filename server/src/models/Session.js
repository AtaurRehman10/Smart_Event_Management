import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     title: { type: String, required: [true, 'Session title is required'], trim: true },
     description: { type: String },
     speaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     speakerName: { type: String },
     room: { type: String },
     venueElementId: { type: String },
     startTime: { type: Date, required: true },
     endTime: { type: Date, required: true },
     capacity: { type: Number, default: 100 },
     registered: { type: Number, default: 0 },
     attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     tags: [{ type: String }],
     status: {
          type: String,
          enum: ['scheduled', 'live', 'completed', 'cancelled'],
          default: 'scheduled',
     },
     notes: { type: String },
     color: { type: String, default: '#6366f1' },
}, { timestamps: true });

sessionSchema.index({ event: 1, startTime: 1 });
sessionSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Session', sessionSchema);
