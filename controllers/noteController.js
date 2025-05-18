import pool from '../services/pool.js';

export const createNote = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title || !description) {
        return res.status(400).json({ status: "false", message: "Please provide title and description" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO notes (title, description, userId) VALUES (?, ?, ?)",
            [title, description, userId]
        );
        res.status(201).json({ status: "true", message: "Note created successfully", noteId: result.insertId });
    } catch (error) {
        console.error("Create Note Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};

export const updateNote = async (req, res) => {
    const { noteId, title, description } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ status: "false", message: "Please provide user ID" });
    }
    if (!title || !description || !noteId) {
        return res.status(400).json({ status: "false", message: "Please provide title, description and note ID" });
    }

    try {
        const [result] = await pool.query(
            "UPDATE notes SET title = ?, description = ? WHERE _id = ? AND userId = ?",
            [title, description, noteId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "false", message: "Note not found or not owned by user" });
        }

        res.status(200).json({ status: "true", message: "Note updated successfully" });
    } catch (error) {
        console.error("Update Note Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};

export const deleteNote = async (req, res) => {
    const { noteId } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ status: "false", message: "Please provide user ID" });
    }
    if (!noteId) {
        return res.status(400).json({ status: "false", message: "Please provide note ID" });
    }

    try {
        const [result] = await pool.query(
            "DELETE FROM notes WHERE _id = ? AND userId = ?",
            [noteId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "false", message: "Note not found or not owned by user" });
        }

        res.status(200).json({ status: "true", message: "Note deleted successfully" });
    } catch (error) {
        console.error("Delete Note Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};

export const getNotes = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ status: "false", message: "Please provide user ID" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT _id, title, description, createdAt, userId FROM notes WHERE userId = ? ORDER BY createdAt DESC",
            [userId]
        );
        res.status(200).json({ status: "true", notes: rows });
    } catch (error) {
        console.error("Get Notes Error:", error);
        res.status(500).json({ status: "false", message: "Server error" });
    }
};
