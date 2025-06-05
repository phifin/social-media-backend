import Community from "../Models/community.js";
import Post from "../Models/post.js";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, avatar, banner, privacy } = req.body;
    const createdBy = req.userId;

    const community = new Community({
      name,
      description,
      avatar,
      banner,
      createdBy,
      members: [createdBy],
      moderators: [createdBy],
      privacy
    });

    await community.save();
    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create community', error: err.message });
  }
};

export const joinCommunity = async (req, res) => {
    try {
      const { communityId } = req.params;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      if (community.members.includes(userId)) {
        return res.status(400).json({ message: 'Already a member' });
      }
  
      if (community.privacy === 'public') {
        community.members.push(userId);
        await community.save();
        return res.status(200).json({ message: 'Joined community successfully', community });
      } else {
        if (!community.pendingRequests.includes(userId)) {
          community.pendingRequests.push(userId);
          await community.save();
        }
        return res.status(200).json({ message: 'Join request sent, pending approval' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to join', error: err.message });
    }
};

export const approveJoinRequest = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { userIdToApprove } = req.body;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      const isModerator = community.moderators.includes(userId) || community.createdBy.toString() === userId;
      if (!isModerator) return res.status(403).json({ message: 'Permission denied' });
  
      if (!community.pendingRequests.includes(userIdToApprove))
        return res.status(400).json({ message: 'No such join request' });
  
      community.pendingRequests = community.pendingRequests.filter(id => id.toString() !== userIdToApprove);
      community.members.push(userIdToApprove);
      await community.save();
  
      res.status(200).json({ message: 'User approved to join', community });
    } catch (err) {
      res.status(500).json({ message: 'Approval failed', error: err.message });
    }
};

export const rejectJoinRequest = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { userIdToReject } = req.body;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      const isModerator = community.moderators.includes(userId) || community.createdBy.toString() === userId;
      if (!isModerator) return res.status(403).json({ message: 'Permission denied' });
  
      community.pendingRequests = community.pendingRequests.filter(id => id.toString() !== userIdToReject);
      await community.save();
  
      res.status(200).json({ message: 'Join request rejected' });
    } catch (err) {
      res.status(500).json({ message: 'Rejection failed', error: err.message });
    }
};
  
  
  

export const getMyCommunities = async (req, res) => {
  try {
    const communities = await Community.find({ members: req.userId });
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch communities', error: err.message });
  }
};

export const addModerator = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { userIdToPromote } = req.body;
      const community = await Community.findById(communityId);
  
      if (!community) return res.status(404).json({ message: 'Community not found' });
      if (!community.members.includes(userIdToPromote)) return res.status(400).json({ message: 'User must be a member to become a moderator' });
  
      if (!community.moderators.includes(userIdToPromote)) {
        community.moderators.push(userIdToPromote);
        await community.save();
      }
  
      res.status(200).json({ message: 'Moderator added', moderators: community.moderators });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add moderator', error: err.message });
    }
};

export const inviteUserToCommunity = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { userIdToInvite } = req.body;
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      if (!community.invitedUsers.includes(userIdToInvite)) {
        community.invitedUsers.push(userIdToInvite);
        await community.save();
      }
  
      res.status(200).json({ message: 'User invited', invitedUsers: community.invitedUsers });
    } catch (err) {
      res.status(500).json({ message: 'Failed to invite user', error: err.message });
    }
};

export const leaveCommunity = async (req, res) => {
    try {
      const { communityId } = req.params;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      community.members = community.members.filter(id => id.toString() !== userId);
      community.moderators = community.moderators.filter(id => id.toString() !== userId);
      await community.save();
  
      res.status(200).json({ message: 'Left community successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to leave community', error: err.message });
    }
};

export const updateCommunityInfo = async (req, res) => {
    try {
      const { communityId } = req.params;
      const { name, avatar, banner, privacy } = req.body;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      if (community.createdBy.toString() !== userId)
        return res.status(403).json({ message: 'Only the creator can update community info' });
  
      if (name !== undefined) community.name = name;
      if (avatar !== undefined) community.avatar = avatar;
      if (banner !== undefined) community.banner = banner;
      if (privacy !== undefined && ['public', 'private'].includes(privacy)) community.privacy = privacy;
  
      await community.save();
      res.status(200).json({ message: 'Community updated', community });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update community', error: err.message });
    }
};

export const deleteCommunity = async (req, res) => {
    try {
      const { communityId } = req.params;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      if (community.createdBy.toString() !== userId)
        return res.status(403).json({ message: 'Only the creator can delete community' });
  
      await Community.findByIdAndDelete(communityId);
      res.status(200).json({ message: 'Community deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete community', error: err.message });
    }
};






export const updateCommunityPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      const { content, images, video, tags, taggedUsers, location } = req.body;
  
      const post = await Post.findById(postId);
      if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });
  
      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Only the author can edit this post' });
      }
  
      post.content = content ?? post.content;
      post.images = images ?? post.images;
      post.video = video ?? post.video;
      post.tags = tags ?? post.tags;
      post.taggedUsers = taggedUsers ?? post.taggedUsers;
      post.location = location ?? post.location;
      post.updatedAt = new Date();
  
      await post.save();
  
      res.status(200).json({ message: 'Post updated', post });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update post', error: err.message });
    }
};

export const getCommunityPostById = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const post = await Post.findById(postId)
        .populate('author', 'username avatar')
        .populate('comments') // nếu bạn muốn lấy luôn comment
        .lean();
  
      if (!post || post.isDeleted) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch post', error: err.message });
    }
};

export const createPostInCommunity = async (req, res) => {
    try {
      const { content, images, video, tags, taggedUsers, location } = req.body;
      const { communityId } = req.params;
      const author = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      if (!community.members.includes(author)) {
        return res.status(403).json({ message: 'You are not a member of this community' });
      }
  
      const post = new Post({
        author,
        content,
        images,
        video,
        tags,
        taggedUsers,
        location,
        privacy: 'public',
        community: communityId,
        isApproved: false // Chờ duyệt
      });
  
      await post.save();
  
      res.status(201).json({ message: 'Post submitted for approval', postId: post._id });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create post in community', error: err.message });
    }
};

export const approveCommunityPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.userId;
  
      const post = await Post.findById(postId);
      if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });
  
      const community = await Community.findById(post.community);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      const isModerator = community.moderators.includes(userId) || community.createdBy.toString() === userId;
      if (!isModerator) return res.status(403).json({ message: 'Permission denied' });
  
      post.isApproved = true;
      await post.save();
  
      res.status(200).json({ message: 'Post approved', post });
    } catch (err) {
      res.status(500).json({ message: 'Approval failed', error: err.message });
    }
};

export const getCommunityPosts = async (req, res) => {
    try {
      const { communityId } = req.params;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      const posts = await Post.find({
        community: communityId,
        isDeleted: false,
        isApproved: true // Chỉ lấy bài đã được duyệt
      })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch community posts', error: err.message });
    }
};

export const getPendingCommunityPosts = async (req, res) => {
    try {
      const { communityId } = req.params;
      const userId = req.userId;
  
      const community = await Community.findById(communityId);
      if (!community) return res.status(404).json({ message: 'Community not found' });
  
      const isModerator = community.moderators.includes(userId) || community.createdBy.toString() === userId;
      if (!isModerator) return res.status(403).json({ message: 'Permission denied' });
  
      const posts = await Post.find({
        community: communityId,
        isDeleted: false,
        isApproved: false
      }).populate('author', 'username avatar');
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch pending posts', error: err.message });
    }
};
  
  
  
  







