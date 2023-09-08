const express = require("express");
const router = express.Router();
const User = require("../db/models/user");

router.post("/users", async (req, res) => {
    let user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

router.get("/users", async (req, res) => {
    try {
        let users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

router.get("/users/:id", async (req, res) => {
    let _id = req.params.id;
    try {
        let users = await User.findById({ _id });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

module.exports = router;
