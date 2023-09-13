const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
    let user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        return res.status(201).send({ signup: "Success", token: token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/me", auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
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

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.user._id });
        // await req.user.remove();
        res.status(200).send(req.user);
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
        return res.send({ login: "Success", user: user, token: token });
        console.log(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send({ logout: "Success" });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ logout: "Success" });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/logoutOtherSessions", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token == req.token;
        });
        await req.user.save();
        res.send({ logout: "Success" });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
