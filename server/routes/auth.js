// ===== backend/routes/auth.js =====
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");


// Register
router.post("/register", async (req, res) => {
const { name, email, password } = req.body;


const userExists = await User.findOne({ email });
if (userExists) return res.status(400).json({ message: "User already exists" });


const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashedPassword });


res.status(201).json({ message: "User registered successfully" });
});


// Login
router.post("/login", async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });


if (!user) return res.status(400).json({ message: "Invalid credentials" });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


const token = jwt.sign(
{ id: user._id, email: user.email },
process.env.JWT_SECRET,
{ expiresIn: "1d" }
);


res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});


// Profile
router.get("/profile", auth, async (req, res) => {
const user = await User.findById(req.user.id).select("-password");
res.json(user);
});


module.exports = router;