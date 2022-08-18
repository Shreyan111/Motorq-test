import express from 'express';
import { getPosts, getPostsBySearch, getPost, createPost, updatePost, likePost, commentPost, deletePost, registerPost, getPostss} from '../controllers/posts.js';
const router = express.Router();
import auth from "../middleware/auth.js";

//@route POST or GET /posts
//@desc Post or Get events which have been named as posts in api
//@access Public
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', commentPost);

router.post('/:id', auth, registerPost);
router.get('/get/:id', auth, getPostss);
export default router;