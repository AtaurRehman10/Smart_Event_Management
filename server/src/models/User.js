import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
     name: { type: String, required: [true, 'Name is required'], trim: true },
     email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          lowercase: true,
          trim: true,
          match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
     },
     passwordHash: { type: String, required: true, select: false },
     role: {
          type: String,
          enum: ['SuperAdmin', 'Organizer', 'Staff', 'Attendee'],
          default: 'Attendee',
     },
     organization: { type: String, trim: true },
     profilePic: { type: String },
     interests: [{ type: String, trim: true }],
     industry: { type: String, trim: true },
     phone: { type: String, trim: true },
     bio: { type: String, maxlength: 500 },
}, { timestamps: true });

// Index for text search
userSchema.index({ name: 'text', email: 'text', organization: 'text', industry: 'text' });

// Hash password before saving
userSchema.pre('save', async function (next) {
     if (!this.isModified('passwordHash')) return next();
     this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
     next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
     return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model('User', userSchema);
