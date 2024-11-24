const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/MYStudent", { useNewUrlParser: true, useUnifiedTopology: true });

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

// Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("sign-up.html");
});

// Start Server 
app.listen(3001, () => {
    console.log("Listening on port 3001");
});
