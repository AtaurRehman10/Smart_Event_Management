import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     name: { type: String, required: true, trim: true },
     width: { type: Number, default: 350 },
     height: { type: Number, default: 500 },
     template: {
          background: { type: String, default: '#1e293b' },
          elements: [{
               type: { type: String, enum: ['text', 'image', 'qrcode', 'shape'], required: true },
               x: { type: Number, default: 0 },
               y: { type: Number, default: 0 },
               width: { type: Number },
               height: { type: Number },
               content: { type: String },
               dynamicField: { type: String },
               fontSize: { type: Number, default: 14 },
               fontWeight: { type: String, default: 'normal' },
               color: { type: String, default: '#ffffff' },
               align: { type: String, default: 'left' },
          }],
     },
     isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Badge', badgeSchema);
