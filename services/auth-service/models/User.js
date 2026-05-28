const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'DSY29QURD12R23TFNO1FFFTY13';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'], trim: true },
    email: { type: String, required: [true, 'Please add an email'], unique: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: [true, 'Please add a password'], minlength: [6, 'Min 6 characters'], select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    avatar: { type: String, default: '' },
    addresses: [{ label: String, street: String, city: String, state: String, zip: String, isDefault: { type: Boolean, default: false } }],
    preferences: { cuisine: [String], dietaryRestrictions: [String], spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'medium' } },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

module.exports = mongoose.model('User', userSchema);
