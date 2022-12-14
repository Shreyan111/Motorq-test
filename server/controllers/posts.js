import express from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

const router = express.Router();

//for getting the posts or event
export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 5;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//for getting the post or event
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const mix = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
const eventCode = () => {
  let code = "";
  let i = 0;
  for (i = 0; i < 6; i++) {
    code += mix[Math.floor(Math.random() * 62)];
  }
  return String(code);
};

const checkEventCode = async (eventCode) => {
  const event = await PostMessage.findOne({ eventCode });
  return event;
};

//for creating the post or event
export const createPost = async (req, res) => {
  const post = req.body;
  let event_code = eventCode();

  if (checkEventCode(event_code)) event_code = eventCode();

  // check for unique event code and then only create

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
    eventCode: event_code,
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//for updating the post or event
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    message,
    creator,
    selectedFile,
    tags,
    likes,
    event_capacity,
    event_start_timestamp,
    event_end_timestamp,
    event_location,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = {
    creator,
    title,
    message,
    tags,
    selectedFile,
    likes,
    event_capacity,
    event_start_timestamp,
    event_end_timestamp,
    event_location,
    _id: id,
  };

  await PostMessage.findByIdAndUpdate(id, updatedPost, {
    new: true,
    upsert: true,
  });

  res.json(updatedPost);
};

//for deleting the post or event
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

//for liking the post or event
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

//QUERY -> /posts?page=1 -> page = 1
//PARAMS -> /posts/:id -> /posts/123 -> id = 123
//for getting posts or event by search or tagname
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); //Test test TEST -> all will be same

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//for commenting the post or event
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

//for registering the post or event
export const registerPost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.event_capacity.findIndex(
    (id) => id === String(req.userId)
  );

  if (index === -1) {
    post.event_capacity.push(req.userId);
  } else if (index === 50) {
    return res.json({ message: "NO MORE REGISTRATION CAN BE DONE!!" });
  } else {
    post.event_capacity = post.event_capacity.filter(
      (id) => id !== String(req.userId)
    );
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

export const checkEvent = async (req, res) => {
  const { code } = req.params;
  const event = await PostMessage.findOne({ eventCode: code });
  if (event) {
    res.status(200).json({ message: "Event found" });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
};

//for getting the posts or events which has been registered by the user
export const getPostss = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PostMessage.aggregate([
      {
        $match: {
          $expr: {
            $in: [id, "$event_capacity"],
          },
        },
      },
    ]);
    res.json({ result });
  } catch (error) {
    res.json({ error: "something went wrong" });
  }
};

export default router;