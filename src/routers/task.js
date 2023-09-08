const express = require("express");
const router = express.Router();
const Task = require("../db/models/task");

router.post("/tasks", async (req, res) => {
    let task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", async (req, res) => {
    try {
        let tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/tasks/:id", async (req, res) => {
    let _id = req.params.id;
    try {
        let task = await Task.findById({ _id });
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
