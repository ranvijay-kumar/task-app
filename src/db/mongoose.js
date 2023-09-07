const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager");

const User = mongoose.model("User", {
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
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
        validate(value) {
            if (value.length <= 6) {
                throw new Error("Password too short");
            }
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
});

const Task = mongoose.model("Task", {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
});

function createUser(name, email, password, age) {
    let user = new User({
        name: name,
        email: email,
        password: password,
        age: age,
    });
    user.save()
        .then((result) => console.log(result))
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            // mongoose.close();
        });
}

function createTask(description, completed) {
    let task = new Task({ description: description, completed: completed });
    task.save()
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {});
}

// createUser("rohan", "abc@gmail.com", "hcsvdgds");
createTask("write notes on conjuction");
