import { Schema, model } from 'mongoose';

const PrivacyUserSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    profilePrivacy: { type: String, enum: ['public', 'friend', 'private'], default: 'public' }, 
    postPrivacy: { type: String, enum: ['public', 'friend', 'private'], default: 'public' },
    
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

export default model('PrivacyUser', PrivacyUserSchema);

