import Post from '../Models/post.js';
import Comment from '../Models/comment.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, author: req.userId });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' }
      });

    if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts (basic pagination)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'name avatar');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post (soft delete)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like or Unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.userId;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ liked: !liked, totalLikes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save or Unsave post
export const toggleSavePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.userId;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const saved = post.savedBy.includes(userId);
    if (saved) {
      post.savedBy.pull(userId);
    } else {
      post.savedBy.push(userId);
    }

    await post.save();
    res.json({ saved: !saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
