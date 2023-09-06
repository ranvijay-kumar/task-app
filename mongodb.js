const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);
const databaseName = "task-manager";

async function run() {
    try {
        const database = client.db(databaseName);
        const users = database.collection("users");
        console.log("inside async method");

        // Query for a movie that has the title 'Back to the Future'
        const query = { name: "Andrew", age: 27 };
        const user = await users.insertOne(query);

        console.log(user);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
// run().catch(console.dir);
async function insertInTask() {
    try {
        client.connect();
        const database = client.db(databaseName);
        const tasks = database.collection("tasks");
        console.log("inside async method");

        // Query for a movie that has the title 'Back to the Future'
        const query = [
            { description: "task one", isCompleted: false },
            { description: "task two", isCompleted: true },
        ];
        const task = await tasks.insertMany(query);

        console.log(task);
    } finally {
        await client.close();
    }
}
// insertInTask().catch(console.dir);
async function findUser() {
    try {
        client.connect();
        const database = client.db(databaseName);
        const users = database.collection("users");
        console.log("inside async method");

        // Query for a movie that has the title 'Back to the Future'
        const query = { name: "Andrew" };
        const user = await users.findOne(query);

        console.log(user);
    } finally {
        await client.close();
    }
}
findUser().catch();
console.log("end of code");
