// ===== backend/routes/tasks.js =====
const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");


// Create Task
router.post("/", auth, async (req, res) => {
const task = await Task.create({
title: req.body.title,
user: req.user.id,
});
res.status(201).json(task);
});


// Get Tasks
router.get("/", auth, async (req, res) => {
const tasks = await Task.find({ user: req.user.id });
res.json(tasks);
});

// Update Task
router.put("/:id", auth, async (req, res) => {
const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(task);
});


// Delete Task
router.delete("/:id", auth, async (req, res) => {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: "Task deleted" });
});


module.exports = router;