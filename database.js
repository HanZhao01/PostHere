const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
//app.use(cors());
//app.use(bodyParser.json());
const dbPassword = 'Any8XVviiJzZEh9A'
const dbConnectionUri = `mongodb+srv://zihanzhao1117:${dbPassword}@cluster0.ftgatsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const dbName = "posthub";

// MongoDB Connection
async function connectToDB() {
    await mongoose.connect(dbConnectionUri, { dbName });
    console.log("Successfully connected to MongoDB");
}

const postHubSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Post: String,
    Date: String,
    Likes: Number,
    Comments: String,
});

const PostHub = mongoose.model("PostHub", postHubSchema);

module.exports = { connectToDB, PostHub };