import express from "express";
const router = express.Router();

import { signin, signup } from "../controllers/user.js";

//@route POST /user
//@desc Auth User
//@access Public
router.post("/signin", signin);
router.post("/signup", signup);

export default router;