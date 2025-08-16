require("dotenv").config({ quiet: true });


const config = require('./config.json');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const User = require("./models/user.model");
mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

// create account endpoint
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res
            .status(400)
            .json({ error: true, message: "All fields are required" });
    }
    try {
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration successful",
    });
    } catch (err) {
    console.error(" Error creating account:", err);
    return res.status(500).json({ error: true, message: "Server error" });
    }
});
// login endpoint
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: true, message: "Email and Password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ error: true, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(400)
            .json({ error: true, message: "Invalid password" });
    }
    const accessToken = jwt.sign(
        { id: user._id }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
        expiresIn: "1d",
    }
);
    res.status(200).json({
        error: false,
        message: "Login successful",
        user: { fullName: user.fullName, email: user.email },
        accessToken,      
    }); 
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

module.exports = app;