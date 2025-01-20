const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express(); 

app.use(bodyParser.json());``
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3001;
//mongoose.connect("mongodb://localhost:27017/MYStudent");
//mongoose.connect("mongodb+srv://chandankumar700451:chandan700451@cluster0.kvvng.mongodb.net/MYStudent?retryWrites=true&w=majority");
const mongoURL ="mongodb+srv://chandankumar700451:chandan700451@cluster0.kvvng.mongodb.net/MYStudent?retryWrites=true&w=majority";
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,  // Optional, but ensures SSL is enabled
  });
  

const db = mongoose.connection;
db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    ABHAID: String,
    phno: String,
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Organization Schema
const orgSchema = new mongoose.Schema({
    orgName: String,
    orgEmail: String,
    orgPassword: String,
});
const Organization = mongoose.model("Organization", orgSchema);

// User Sign-Up Route
app.post("/sign_up", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        console.log("User Record Inserted Successfully");
        res.send("User signup successful!");
    } catch (err) {
        console.error("Error inserting user data:", err);
        res.status(500).send("Database Insertion Error");
    }
});

// Organization Sign-Up Route
app.post("/sign_up_org", async (req, res) => {
    try {
        const { orgName, orgEmail, orgPassword } = req.body;

        const newOrg = new Organization({
            orgName,
            orgEmail,
            orgPassword,
        });

        await newOrg.save();
        console.log("Organization Record Inserted Successfully");
        res.send("Organization signup successful!");
    } catch (err) {
        console.error("Error inserting organization data:", err);
        res.status(500).send("Database Insertion Error");
    }   
});


app.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Extract the user ID from the URL parameter
        const updatedUserData = req.body; // Get the updated data from the request body

        const response = await User.findByIdAndUpdate(userId, updatedUserData, {
            new: true, // Return the updated document
            runValidators: true // Run validation on the updated data
        });

        if (!response) { 
            return res.status(404).json({ error: 'User not found' }); // Handle case where user is not found
        }

        console.log('User data updated');
        res.status(200).json(response); // Send the updated user data in the response
    } catch (err) {
        console.log('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("Frontpage.html");
});

// Start Server 
app.listen(port, () => {
    console.log("Listening on port 3001");
});
