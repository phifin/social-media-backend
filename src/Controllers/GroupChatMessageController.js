import GroupChatMessage from "../Models/groupChatMessage.js";

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await GroupChatMessage.find({ groupId }).populate('sender', 'username');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};
