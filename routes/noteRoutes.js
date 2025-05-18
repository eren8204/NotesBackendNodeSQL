import express from 'express';
import auth from '../middlewares/auth.js';
const noteRouter = express.Router();
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/noteController.js';

noteRouter.post("/createNote",auth,createNote);
noteRouter.post("/getAllNotes",auth, getNotes);
noteRouter.post("/updateNote",auth, updateNote);
noteRouter.post("/deleteNote",auth, deleteNote);

export default noteRouter;