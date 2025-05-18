import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import userRouter from '../routes/userRoutes.js';
import noteRouter from '../routes/noteRoutes.js';
dotenv.config();
const app = express();
app.use(cors())
app.use(helmet());
app.use(express.json());
app.use((req,res,next)=>{
    console.log("HTTP Method: ", req.method, "URL: ", req.url, "Body: ", req.body);
    next();
});
app.use("/user", userRouter);
app.use("/note", noteRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the Note Taking App");
});
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.SERVER_PORT}`);
});