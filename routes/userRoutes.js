import express from 'express';
import { signup, signin } from '../controllers/userController.js';
import dotenv from 'dotenv';
dotenv.config();
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;