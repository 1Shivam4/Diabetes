import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your username'],
    },
    userHandle: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: [true, 'Email already exists'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: function (el) {
        return el === this.password;
      },
      message: 'Passwords should be same',
    },
    isEmailVerified: { type: Boolean, default: true },
    verificationToken: String,
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'freelancer'],
      default: 'user',
    },
    photo: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    banned: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

//////////// Encryption of users password, address, email ///////////////

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return token;
};

userSchema.methods.forgetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

//////////// make methods to dcrypt the users password and login them /////////////////
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
