import mongoose from 'mongoose';

const businessCardSchema = new mongoose.Schema({
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     name: { type: String, required: true },
     email: { type: String },
     phone: { type: String },
     company: { type: String },
     title: { type: String },
     website: { type: String },
     linkedin: { type: String },
     scannedFrom: { type: String },
     notes: { type: String },
}, { timestamps: true });

businessCardSchema.index({ owner: 1 });

export default mongoose.model('BusinessCard', businessCardSchema);
