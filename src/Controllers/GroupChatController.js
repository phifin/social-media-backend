import GroupChat from "../Models/groupChat.js";

export const createGroup = async (req, res) => {
  try {
    const { name, imageGroupChat, members } = req.body;
    const admin = req.userId;

    const group = new GroupChat({ name, imageGroupChat, admin, members: [admin, ...members] });
    await group.save();

    res.status(201).json({ message: 'Group created', group });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const groups = await GroupChat.find({ members: req.userId });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
  }
};

export const addMembersToGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const { newMembers } = req.body; 
      const group = await GroupChat.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      const uniqueMembers = newMembers.filter(
        (memberId) => !group.members.includes(memberId)
      );
      group.members.push(...uniqueMembers);
  
      await group.save();
  
      res.status(200).json({ message: 'Members added', group });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add members', error: err.message });
    }
  };
