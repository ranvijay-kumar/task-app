const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Incorrect email format");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Password cannot include password");
            }
        },
    },
    age: {
        type: Number,
        required: false,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age cannot be negative");
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    profile_pic: {
        type: Buffer
    },
});

userSchema.virtual("task", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner",
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id.toString() },
        "thisismyprivatekey"
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        } else {
            throw new Error("Unable to login");
        }
    } else {
        throw new Error("Unable to login");
    }
};

userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({ _id: user._id });
    next();
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
