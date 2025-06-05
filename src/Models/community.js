import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  avatar: String,
  banner: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Community', CommunitySchema);
