const express = require("express");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connectToDB, PostHub } = require("./database");

app.use(express.static(__dirname + "/public"));

app.post("/signup", asyncHandler(async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newUser = new PostHub({
        Username: username,
        Password: password,
        Post: null,
        Date: null,
        Likes: null,
        Comments: null
    });
    await newUser.save()
    res.status(201).json(newUser);
}));

app.post("/login", asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = await PostHub.findOne({ Username: username });
    if (!user) {
        return res.status(404).json({ message: "Username not found" });
    }

    // Check if the submitted password matches the one stored in the database
    // This assumes the password is stored as plain text, which is insecure
    if (password !== user.Password) {
        return res.status(401).json({ message: "Password is incorrect" });
    }

    // Login successful
    res.json({ message: "Login successful", user: { username: user.Username } }); // Be cautious about what information you send back
}));

// Assuming express is already set up
app.get('/dashboard', (req, res) => {
    // Normally, you'd authenticate the user and fetch their data
    // For demonstration, pass the username via query, e.g., /dashboard?username=JohnDoe
    if (!req.query.username) {
        return res.status(401).send('You are not authorized to view this page');
    }

    res.sendFile(__dirname + '/public/dashboard.html');
});

app.post("/makepost", asyncHandler(async (req, res) => {
    const { username, postContent } = req.body;

    // Assume you may want to store each post as a separate document
    // If the PostHub model is for users, you might need a different model for posts
    const newPost = new PostHub({
        Username: username,  // Owner of the post
        Post: postContent,
        Date: new Date(),    // Capture the date of the post
        Likes: 0,
        Comments: null        // Initialize comments as an empty array
    });

    await newPost.save();
    res.status(201).json(newPost);
}));

app.get('/viewposts', asyncHandler(async (req, res) => {
    try {
        // Fetch only posts where the 'Post' field is neither null nor an empty string
        const posts = await PostHub.find({ Post: { $nin: [null, ""] } }).select("Username Post Likes");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
}));


app.post('/likepost', asyncHandler(async (req, res) => {
    const {postId} = req.body;
    console.log("Attempting to like post with ID:", postId); // Log the postId to verify it's correct

    try {
        const updatedPost = await PostHub.findByIdAndUpdate(
            postId, 
            { $inc: { Likes: 1 } },
            { new: true }
        );

        if (!updatedPost) {
            console.log("No post found with ID:", postId);
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("Post liked successfully, new likes count:", updatedPost.Likes);
        res.json({ message: "Like updated successfully", likes: updatedPost.Likes });
    } catch (error) {
        console.error("Error updating likes for post ID", postId, ":", error);
        res.status(500).json({ message: 'Error updating likes', error: error.message });
    }
}));





//// hw7 //////////////////////////////////////////////////////
app.post("/new", asyncHandler(async (req, res) => {
    const frontWord = req.body.front
    const backWord = req.body.back
    const newCard = new Flashcard({front: frontWord, back: backWord}) ;
    await newCard.save()
    res.status(201).json(newCard);
}));

// QUESTION 7. Finish this route handler that finds a card by its id and returns it as JSON.
app.get("/card/:id", asyncHandler(async (req, res) => {
    const id = new Flashcard({});
    const cardId = req.params.id;
    const foundCard = await Flashcard.findById(cardId)
    if (!foundCard) {
        return res.status(404).json({ message: "Card not found" });
    }
    res.json(foundCard)
}));

////////////////////////////////////////////////////////////////



async function start() {
    await connectToDB();

    return app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
}

if (require.main === module) {
    start().catch((err) => console.error(err));
}