const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const path = require('path');
const { authenticateToken } = require('./utilities');
const { NotesModel } = require('./models/Notes.model');
const { UserModel } = require('./models/User.model');
const { connection } = require('./config/db');

dotenv.config(); // Load environment variables
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'local' ? 'http://localhost:5173' : '*',
    credentials: true,
}));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './', 'frontend', 'dist', 'index.html'));
    });
}

// Database Connection
const dbConnect = async () => {
    try {
        const dbUri = process.env.NODE_ENV === 'local' ? process.env.LOCAL_DB_URI : process.env.MONGODB_URI;
        if (!dbUri) throw new Error('Database URI is not defined.');
        await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`${process.env.NODE_ENV === 'local' ? 'Local' : 'Production'} database connected.`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

dbConnect(); // Initialize database connection

// API Routes
// User Registration
app.post("/create-account", async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required." });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.json({ error: true, message: "User already exists." });
    }

    const user = new UserModel({ fullname, email, password });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300m" });

    res.json({ error: false, user, accessToken, message: "Registration successful." });
});

// User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(400).json({ error: true, message: "Invalid credentials." });
    }

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
    res.json({ error: false, message: "Login successful.", email, accessToken });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) return res.sendStatus(401);

    res.json({
        user: {
            fullname: foundUser.fullname,
            email: foundUser.email,
            _id: foundUser._id,
            createdOn: foundUser.createdOn,
        },
        message: "",
    });
});

// Notes CRUD Operations
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and content are required." });
    }

    try {
        const note = new NotesModel({ title, content, tags: tags || [], userId: user._id });
        await note.save();
        res.json({ error: false, note, message: "Note added successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
});

app.get("/get-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await NotesModel.find({ userId: user._id }).sort({ isPinned: -1 });
        res.json({ error: false, notes, message: "Notes retrieved successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await NotesModel.findOne({ _id: noteId, userId: user._id });
        if (!note) return res.status(404).json({ error: true, message: "Note not found." });

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();
        res.json({ error: false, note, message: "Note updated successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;

    try {
        const note = await NotesModel.findOne({ _id: noteId, userId: user._id });
        if (!note) return res.status(404).json({ error: true, message: "Note not found." });

        await NotesModel.deleteOne({ _id: noteId, userId: user._id });
        res.json({ error: false, message: "Note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
});

// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { user } = req.user;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required." });
    }

    try {
        const notes = await NotesModel.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });
        res.json({ error: false, notes, message: "Matching notes retrieved successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error." });
    }
});

// Start Server
app.listen(process.env.PORT || 5000, async () => {
    try {
        await connection;
        console.log("Database connected.");
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
    console.log(`Server running on port ${process.env.PORT || 5000}.`);
});

module.exports = app;
