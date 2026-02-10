import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
     event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
     name: { type: String, required: true, trim: true },
     type: { type: String, enum: ['General', 'VIP', 'Workshop', 'Student', 'Speaker'], default: 'General' },
     price: { type: Number, required: true, min: 0 },
     earlyBirdPrice: { type: Number, min: 0 },
     earlyBirdDeadline: { type: Date },
     groupDiscountThreshold: { type: Number, default: 5 },
     groupDiscountPercent: { type: Number, default: 10, min: 0, max: 100 },
     quantity: { type: Number, required: true, min: 1 },
     sold: { type: Number, default: 0 },
     maxPerOrder: { type: Number, default: 10 },
     description: { type: String },
     benefits: [{ type: String }],
     isActive: { type: Boolean, default: true },
}, { timestamps: true });

ticketSchema.index({ event: 1 });

// Virtual for available count
ticketSchema.virtual('available').get(function () {
     return this.quantity - this.sold;
});

// Virtual for current price (early bird check)
ticketSchema.virtual('currentPrice').get(function () {
     if (this.earlyBirdPrice && this.earlyBirdDeadline && new Date() < this.earlyBirdDeadline) {
          return this.earlyBirdPrice;
     }
     return this.price;
});

ticketSchema.set('toJSON', { virtuals: true });
ticketSchema.set('toObject', { virtuals: true });

export default mongoose.model('Ticket', ticketSchema);
