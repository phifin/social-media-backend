import PrivacyUser from '../Models/privacyUser.js';

export const updateProfilePrivacy = async (req, res) => {
  try {
    const userId = req.userId; 
    const { profilePrivacy } = req.body;

    const validOptions = ['public', 'friend', 'private'];
    if (!validOptions.includes(profilePrivacy)) {
      return res.status(400).json({ message: 'Invalid profile privacy option' });
    }

    const updatedUser = await PrivacyUser.findOneAndUpdate(
      { userId: userId },
      { profilePrivacy },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Privacy settings not found for this user' });
    }

    res.status(200).json({
      message: 'Profile privacy updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePostPrivacy = async (req, res) => {
  try {
    const userId = req.userId;
    const { postPrivacy } = req.body;

    const validOptions = ['public', 'friend', 'private'];
    if (!validOptions.includes(postPrivacy)) {
      return res.status(400).json({ message: 'Invalid post privacy option' });
    }

    const updatedUser = await PrivacyUser.findOneAndUpdate(
      { userId: userId },
      { postPrivacy },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Privacy settings not found for this user' });
    }

    res.status(200).json({
      message: 'Post privacy updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
