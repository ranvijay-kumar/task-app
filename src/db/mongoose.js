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

let andrew = new User({ name: "andrew njvbfs  ", email: "abc@gmail.com" });
andrew
    .save()
    .then((result) => console.log(result))
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        // mongoose.close();
    });
