import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },                
  type: { type: String, enum: ["text", "image"], default: "text" },
  imageUrl: { type: String },              
  createdAt: { type: Date, default: Date.now },
});

export default model("Message", messageSchema);
