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

router.delete("/users/:id", async (req, res) => {
    let _id = req.params.id;
    try {
        let user = await User.findByIdAndDelete({ _id });
        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        let user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        return res.send({ login: "Success", token: token });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
