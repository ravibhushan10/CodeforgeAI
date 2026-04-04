import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, default: null },
  initials:     { type: String, default: '' },
  bio:          { type: String, default: '' },
  github:       { type: String, default: '' },
  linkedin:     { type: String, default: '' },
  avatarUrl:    { type: String, default: '' },
  oauthProvider:{ type: String, enum: ['google', 'github', 'local', 'admin'], default: 'local' },
  oauthId:      { type: String, default: null, sparse: true },


  isVerified:            { type: Boolean, default: false },
  verifyOtp:             { type: String,  default: null },
  verifyOtpExpires:      { type: Date,    default: null },
  verifyOtpAttempts:     { type: Number,  default: 0    },
  verifyOtpLockedUntil:  { type: Date,    default: null },
  verifyOtpSentAt:       { type: Date,    default: null },


  verificationToken:     { type: String,  default: null },
  verificationExpires:   { type: Date,    default: null },


  refreshTokenHash: { type: String, default: null },


  resetOtp:          { type: String,  default: null },
  resetOtpExpires:   { type: Date,    default: null },
  resetOtpAttempts:  { type: Number,  default: 0    },
  resetOtpLockedUntil:{ type: Date,   default: null },
  resetOtpSentAt:    { type: Date,    default: null },

  rating:       { type: Number, default: 0 },
  ratingTitle:  { type: String, default: 'Beginner' },
  streak:       { type: Number, default: 0 },
  streakLast:   { type: String, default: null },
  coins:        { type: Number, default: 0 },
  plan:         { type: String, enum: ['free', 'pro'], default: 'free' },
  proSince:     { type: Date,   default: null },
  lastPaymentId:{ type: String, default: null },
  lastOrderId:  { type: String, default: null },
  langPref:     { type: String, default: 'python' },
  solved:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  attempted:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  bookmarked:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  isAdmin:      { type: Boolean, default: false },
}, {
  timestamps: true,
  autoIndex:  false,
});

UserSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.initials) {
    this.initials = this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
  next();
});

export default mongoose.model('User', UserSchema);
