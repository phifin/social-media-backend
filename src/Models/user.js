import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true }, 
    password: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' }, // ảnh đại diện
    coverPhoto: { type: String, default: '' }, // ảnh bìa
    bio: { type: String, default: '' }, // thông tin giới thiệu
    dateOfBirth: { type: Date }, 
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' }, 

}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = function (inputPassword) {
  return compare(inputPassword, this.password);
};

export default model('User', UserSchema);
