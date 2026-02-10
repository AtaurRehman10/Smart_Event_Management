import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     name: { type: String, required: true, trim: true },
     address: { type: String },
     totalCapacity: { type: Number },
     floorPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FloorPlan' }],
}, { timestamps: true });

venueSchema.index({ event: 1 });

export default mongoose.model('Venue', venueSchema);
