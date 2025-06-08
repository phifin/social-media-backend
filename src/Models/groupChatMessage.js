import mongoose from 'mongoose';

const groupChatMessageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, default: null }, 
  video: { type: String },   
});

export default mongoose.model('GroupChatMessage', groupChatMessageSchema);
