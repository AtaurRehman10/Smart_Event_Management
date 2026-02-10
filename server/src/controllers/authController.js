import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const generateToken = (id) => {
     return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
     try {
          const { name, email, password, role, organization, interests, industry } = req.body;

          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({ success: false, message: 'Email already registered' });
          }

          const user = await User.create({
               name,
               email,
               passwordHash: password,
               role: role || 'Attendee',
               organization,
               interests,
               industry,
          });

          // Send welcome email (fire-and-forget — don't block registration)
          sendWelcomeEmail(user.name, user.email).catch((err) => {
               console.warn('⚠️  Failed to send welcome email:', err.message);
          });

          const token = generateToken(user._id);
          const userObj = user.toObject();
          delete userObj.passwordHash;

          res.status(201).json({ success: true, token, user: userObj });
     } catch (error) {
          next(error);
     }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
     try {
          const { email, password } = req.body;

          if (!email || !password) {
               return res.status(400).json({ success: false, message: 'Email and password are required' });
          }

          const user = await User.findOne({ email }).select('+passwordHash');
          if (!user) {
               return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
               return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const token = generateToken(user._id);
          const userObj = user.toObject();
          delete userObj.passwordHash;

          res.json({ success: true, token, user: userObj });
     } catch (error) {
          next(error);
     }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
     res.json({ success: true, user: req.user });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
     try {
          const { name, organization, interests, industry, phone, bio } = req.body;
          const user = await User.findByIdAndUpdate(
               req.user._id,
               { name, organization, interests, industry, phone, bio },
               { new: true, runValidators: true }
          );
          res.json({ success: true, user });
     } catch (error) {
          next(error);
     }
};
