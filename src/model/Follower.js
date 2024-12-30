// models/Follower.js
import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for performance
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true }); // Prevent duplicate relationships
followerSchema.index({ followerId: 1 }); // Optimize queries for followers
followerSchema.index({ followingId: 1 }); // Optimize queries for followings

const Follower = mongoose.models.Follower || mongoose.model('Follower', followerSchema);

export default Follower;
