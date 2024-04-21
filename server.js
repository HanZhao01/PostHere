const express = require("express");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connectToDB, PostHub } = require("./database");

app.post("/signup", asyncHandler(async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newUser = new PostHub({
        Username: username,
        Password: password,
        Post: None,
        Date: None,
        Likes: None,
        Comments: None,
    });
    await newUser.save()
    res.status(201).json(newUser);
}));








async function start() {
    await connectToDB();

    return app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
}

if (require.main === module) {
    start().catch((err) => console.error(err));
}