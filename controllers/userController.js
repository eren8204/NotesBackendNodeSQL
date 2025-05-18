import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../services/pool.js';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.status(201).json({status:"success", message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ status:"error", message: "Server error" });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [userRows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (userRows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = userRows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({status:"success", message: "Signin successful", token});
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error" });
    }
};