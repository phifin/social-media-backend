import User from '../Models/user.js';
import privacyUser from '../Models/privacyUser.js';

const UserController = {
  // getCurrentUser: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.userId).select('-password');
  //     if (!user) return res.status(404).json({ message: 'User not found' });
  //     res.json(user);
  //   } catch (err) {
  //     res.status(500).json({ message: 'Server error', error: err.message });
  //   }
  // },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const privacy = await privacyUser.findOne({ userId: req.userId })
        .populate('friends', '_id username avatar')
        .populate('following', '_id username avatar')
        .populate('followers', '_id username avatar')
        .populate('blocked', '_id username avatar');
  
      res.json({ user, privacy });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const allowedFields = ['username', 'avatar', 'coverPhoto', 'bio', 'phone', 'dateOfBirth', 'gender'];
      const updates = {};

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
      res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Password change failed', error: err.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.userId);
      res.json({ message: 'Account deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Deletion failed', error: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Could not fetch users', error: err.message });
    }
  },

  // getUserById: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.params.id).select('-password');
  //     if (!user) return res.status(404).json({ message: 'User not found' });
  //     res.json(user);
  //   } catch (err) {
  //     res.status(500).json({ message: 'Error retrieving user', error: err.message });
  //   }
  // },

  getUserById : async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const privacy = await privacyUser.findOne({ userId })
        .select('-_id -__v') 
        .populate('friends', 'username avatar')
        .populate('following', 'username avatar')
        .populate('followers', 'username avatar')
        .populate('blocked', 'username avatar');
  
      res.json({
        user,
        privacy: privacy || {},
      });
  
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
  },
  searchUsers: async (req, res) => {
    try {
      const { username } = req.query;
  
      if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username query is required' });
      }
  
      const regex = new RegExp(username, 'i'); 
      const users = await User.find({ username: { $regex: regex } })
        .select('-password -__v'); 
  
      res.status(200).json({ message: 'Users found', users });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  followOrUnfollowUser: async (req, res) => {
    try {
      const currentUserId = req.userId;
      const targetUserId = req.params.targetUserId;
  
      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
      }
  
      const currentPrivacy = await privacyUser.findOne({ userId: currentUserId });
      const targetPrivacy = await privacyUser.findOne({ userId: targetUserId });
  
      if (!currentPrivacy || !targetPrivacy) {
        return res.status(404).json({ message: 'One or both users not found' });
      }
  
      const isFollowing = currentPrivacy.following.includes(targetUserId);
  
      if (isFollowing) {
        currentPrivacy.following.pull(targetUserId);
        targetPrivacy.followers.pull(currentUserId);
        await currentPrivacy.save();
        await targetPrivacy.save();
        return res.status(200).json({ message: 'Unfollowed successfully' });
      } else {
        currentPrivacy.following.push(targetUserId);
        targetPrivacy.followers.push(currentUserId);
        await currentPrivacy.save();
        await targetPrivacy.save();
        return res.status(200).json({ message: 'Followed successfully' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  getMyFollowers: async (req, res) => {
    try {
      const userId = req.userId;
  
      const PrivacyUser = await privacyUser.findOne({ userId }).populate('followers', 'username email');
      if (!PrivacyUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ followers: PrivacyUser.followers });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving followers', error: error.message });
    }
  },
  
  getMyFollowing: async (req, res) => {
    try {
      const userId = req.userId;
  
      const PrivacyUser = await privacyUser.findOne({ userId }).populate('following', 'username email');
      if (!PrivacyUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ following: PrivacyUser.following });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving following list', error: error.message });
    }
  }


};

export default UserController;
