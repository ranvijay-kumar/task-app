const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const profile_pic_uploader = multer({
    // dest: "images/profile_pic",
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/gim)) {
            callback(new Error("File must be an image"));
        }
        callback(undefined, true);
    },
});

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
        res.status(500).send(error);
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ logout: "Success" });
    } catch (error) {
        res.status(500).send(error);
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

router.get("/users/:id/profilePic", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profile_pic) {
            throw new Error();
        }
        res.set("Content-Type", "image/png");
        res.send(user.profile_pic);
    } catch (error) {}
});

router.post(
    "/users/profilePic",
    auth,
    profile_pic_uploader.single("profile_pic"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 240, height: 240 })
            .png()
            .toBuffer();
        req.user.profile_pic = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.delete("/users/profilePic", auth, async (req, res) => {
    req.user.profile_pic = undefined;
    await req.user.save();
    res.send();
});

module.exports = router;
