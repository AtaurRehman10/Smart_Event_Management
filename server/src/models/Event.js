import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
     title: { type: String, required: [true, 'Event title is required'], trim: true },
     description: { type: String, trim: true },
     organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     logo: { type: String },
     banner: { type: String },
     startDate: { type: Date, required: [true, 'Start date is required'] },
     endDate: { type: Date, required: [true, 'End date is required'] },
     location: {
          name: { type: String },
          address: { type: String },
          city: { type: String },
          country: { type: String },
     },
     timezone: { type: String, default: 'UTC' },
     category: { type: String, trim: true },
     tags: [{ type: String, trim: true }],
     metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
     status: {
          type: String,
          enum: ['draft', 'published', 'archived', 'cancelled'],
          default: 'draft',
     },
     isTemplate: { type: Boolean, default: false },
     duplicatedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
     maxAttendees: { type: Number },
     registrationDeadline: { type: Date },
     customFields: [{
          label: { type: String },
          type: { type: String, enum: ['text', 'select', 'checkbox', 'number', 'email', 'textarea'] },
          required: { type: Boolean, default: false },
          options: [String],
          condition: { type: mongoose.Schema.Types.Mixed },
     }],
}, { timestamps: true });

// Indexes
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Event', eventSchema);
