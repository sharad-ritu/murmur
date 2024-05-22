import User from '../models/User.js';
import { wrapper } from '../utils/wrapper.js';

/** READ */
export const getUser = wrapper( async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
});

export const getUserFriends = wrapper( async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return {  _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(200).json({ formattedFriends });
});

/** UPDATE */
export const addRemoveFriend = wrapper( async (req, res) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return {  _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(200).json({ formattedFriends });
});