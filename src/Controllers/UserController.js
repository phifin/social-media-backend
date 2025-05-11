import User from '../Models/user.js';

const UserController = {
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
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

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
  }
};

export default UserController;
