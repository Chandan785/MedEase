const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware 
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect("mongodb://localhost:27017/MYStudent", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

// User Schema 
const userSchema = new mongoose.Schema({
    name: String,
    ABHAID: String,
    phno: Number,
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Organization Schema
const orgSchema = new mongoose.Schema({
    orgName: String,
    orgId: String, // Add `orgId` field to match client request
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
        const { orgName, orgId, orgEmail, orgPassword } = req.body;

        const newOrg = new Organization({
            orgName,
            orgId,
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
    const { orgName, orgId, orgPassword } = req.body;

    try {
        const organization = await Organization.findOne({
            orgName,
            orgId,
            orgPassword,
        });
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

// Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("sign-up.html");
});

// Start Server
app.listen(3001, () => {
    console.log("Listening on port 3001");
});
