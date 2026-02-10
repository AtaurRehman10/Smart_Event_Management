import mongoose from 'mongoose';

const floorPlanSchema = new mongoose.Schema({
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     name: { type: String, required: true, trim: true },
     width: { type: Number, default: 1200 },
     height: { type: Number, default: 800 },
     backgroundImage: { type: String },
     svgData: { type: String },
     elements: [{
          id: { type: String, required: true },
          type: { type: String, enum: ['room', 'booth', 'stage', 'entrance', 'restroom', 'zone', 'text'], required: true },
          x: { type: Number, required: true },
          y: { type: Number, required: true },
          width: { type: Number, default: 100 },
          height: { type: Number, default: 80 },
          rotation: { type: Number, default: 0 },
          label: { type: String },
          capacity: { type: Number, default: 0 },
          occupied: { type: Number, default: 0 },
          color: { type: String, default: '#6366f1' },
          metadata: { type: mongoose.Schema.Types.Mixed },
     }],
}, { timestamps: true });

floorPlanSchema.index({ event: 1 });

export default mongoose.model('FloorPlan', floorPlanSchema);
