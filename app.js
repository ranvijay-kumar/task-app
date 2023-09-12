const express = require("express");
const app = express();
require("./src/db/mongoose");
const userRouter = require("./src/routers/user");
const taskRouter = require("./src/routers/task");
const jwt = require("jsonwebtoken");

const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("App is listening on port:" + port);
});
