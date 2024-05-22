import Post from '../models/Post.js';
import User from '../models/User.js';
import { wrapper } from '../utils/wrapper.js';

/** CREATE */
export const createPost = wrapper( async (req, res) => {
  const { userId, description, picturePath } = req.body;
  const user = await User.findById(userId);
  const newPost = new Post({
    userId,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    userPicturePath: user.picturePath,
    picturePath,
    likes: {},
    comments: []
  });

  await newPost.save();

  const posts = await Post.find();

  res.status(201).json(posts);
});

/** READ */
export const getFeedPosts = wrapper( async (req, res) => {
  const post = await Post.find();

  res.status(200).json(post);
})

export const getUserPosts = wrapper( async (req, res) => {
  const { userId } = req.params;

  const posts = await Post.find({ userId });
  res.status(200).json(posts);
});

/** UPDATE */
export const likePost = wrapper( async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(id);
  const isLiked = post.likes.get(userId);

  if (isLiked)
    post.likes.delete(userId);
  else
    post.likes.set(userId, true);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true}
  );

  res.status(200).json(updatedPost);
})
