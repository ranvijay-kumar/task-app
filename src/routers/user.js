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

module.exports = router;
