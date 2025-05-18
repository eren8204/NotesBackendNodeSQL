import express from 'express';
import jwt from 'jsonwebtoken';

const auth = (req,res,next)=>{
    try {
        let token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        else{
            token = token.split(" ")[1];
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}
export default auth;