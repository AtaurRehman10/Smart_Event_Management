import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
     status: {
          type: String,
          enum: ['confirmed', 'waitlisted', 'cancelled', 'pending'],
          default: 'pending',
     },
     formResponses: { type: mongoose.Schema.Types.Mixed, default: {} },
     qrCode: { type: String },
     paymentIntentId: { type: String },
     paymentStatus: {
          type: String,
          enum: ['pending', 'paid', 'refunded', 'failed'],
          default: 'pending',
     },
     amount: { type: Number },
     groupId: { type: String },
     checkedIn: { type: Boolean, default: false },
     checkInTime: { type: Date },
}, { timestamps: true });

registrationSchema.index({ event: 1, user: 1 }, { unique: true });
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ qrCode: 1 });

export default mongoose.model('Registration', registrationSchema);
