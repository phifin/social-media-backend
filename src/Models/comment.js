import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String }, 
  imageUrl: { type: String, default: null }, 
  video: { type: String },   
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // Cho reply comment
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('Comment', CommentSchema);
