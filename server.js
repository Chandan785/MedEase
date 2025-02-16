const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const port = process.env.mongoURL;

// MongoDB Connection
//const mongoURL = "mongodb://localhost:27017/MYStudent";
mongoose.connect(mongoURL)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.error("Error connecting to Database:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    ABHAID: {
        type: String,
        required: true,
        unique: true
    },
    phno: String,
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Organization Schema
const orgSchema = new mongoose.Schema({
    orgName: String,
    orgEmail: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
    },
    orgPassword: String,
});
const Organization = mongoose.model("Organization", orgSchema);

// Ensure Indexes are Created
Organization.init().then(() => {
   // console.log("Organization indexes created successfully");
}).catch(err => {
    console.error("Error creating Organization indexes:", err);
});

// User Sign-Up Route
app.post("/sign_up", async (req, res) => { 
    try {
        const user = new User(req.body);
        await user.save();
        console.log("User Record Inserted Successfully");
        res.send("User signup successful!");
    } catch (err) {
        console.error("Error inserting user data:", err);
        if (err.code === 11000) {
            res.status(400).send("ABHA ID or email must be unique.");
        } else {
            res.status(500).send("Database Insertion Error");
        }
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
        if (err.code === 11000) {
            res.status(400).send("Organization email must be unique.");
        } else {
            res.status(500).send("Database Insertion Error");
        }
    }
});

// User Sign-In Route
app.post("/sign_in", async (req, res) => {
    const { ABHAID, password } = req.body;

    try {
        const user = await User.findOne({ ABHAID, password });
        if (user) {
            console.log("User Sign-In Successful");
            res.status(200).send("User Sign-In Successful");
        } else {
            console.log("Invalid User Credentials");
            res.status(401).send("Invalid ABHA ID or Password");
        }
    } catch (err) {
        console.error("Error during User Sign-In:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Organization Sign-In Route
app.post("/sign_in_org", async (req, res) => {
    const { orgEmail, orgPassword } = req.body;

    try {
        const organization = await Organization.findOne({ orgEmail, orgPassword });
        if (organization) {
            console.log("Organization Sign-In Successful");
            res.status(200).send("Organization Sign-In Successful");
        } else {
            console.log("Invalid Organization Credentials");
            res.status(401).send("Invalid Organization Credentials");
        }
    } catch (err) {
        console.error("Error during Organization Sign-In:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Update User Route
app.put("/update:id", async (req, res) => {
    try {
        const userId = req.params.id; // Extract the user ID from the URL parameter
        const updatedUserData = req.body; // Get the updated data from the request body

        const response = await User.findByIdAndUpdate(userId, updatedUserData, {
            new: true, // Return the updated document
            runValidators: true // Run validation on the updated data
        });

        if (!response) {
            return res.status(404).json({ error: "User not found" }); // Handle case where user is not found
        }

        console.log("User data updated");
        res.status(200).json(response); // Send the updated user data in the response
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("Frontpage.html");
});

// Start Server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
