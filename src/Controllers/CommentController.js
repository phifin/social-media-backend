import Comment from '../Models/comment.js';
import Post from '../Models/post.js';

// let ioInstance;
// export const setIoInstance = (io) => {
//   ioInstance = io;
// };
// export const createComment = async (req, res) => {
//   try {
//     const { content, parentComment } = req.body;
//     const postId = req.params.postId;

//     const newComment = new Comment({
//       post: postId,
//       content,
//       author: req.userId,
//       parentComment: parentComment || null
//     });

//     await newComment.save();

//     // Add comment reference to post
//     await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

//     res.status(201).json(newComment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

let ioInstance;
export const setIoInstance = (io) => {
  ioInstance = io;
};

export const createComment = async (req, res) => {
  try {
    const { content, parentComment, imageUrl, video } = req.body;
    const postId = req.params.postId;

    const newComment = new Comment({
      post: postId,
      content,
      author: req.userId,
      parentComment: parentComment || null,
      imageUrl: imageUrl || null,
      video: video || null
    });

    await newComment.save();

    // Add comment reference to post
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like / Unlike comment
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.userId;

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const liked = comment.likes.includes(userId);
    if (liked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ liked: !liked, totalLikes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment (soft delete)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!comment) return res.status(404).json({ message: 'Comment not found or unauthorized' });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId, isDeleted: false })
      .select('content author imageUrl video likes createdAt parentComment')
      .sort({ createdAt: -1 }); 

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .where({ isDeleted: false })
      .populate('author', 'username avatar');

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getReplies = async (req, res) => {
  try {
    const parentCommentId = req.params.id;
    const replies = await Comment.find({
      parentComment: parentCommentId,
      isDeleted: false
    })
      .sort({ createdAt: 1 })
      .populate('author', 'username avatar');

    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



