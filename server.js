const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// MongoDB Connection
const mongoURL = process.env.MONGO_URL; // Use .env for security
mongoose.connect(mongoURL)
    .then(() => console.log("✅ Connected to Database"))
    .catch((err) => console.error("❌ Error connecting to Database:", err));
 
// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    ABHAID: { type: String, required: true, unique: true },
    phno: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// Organization Schema
const orgSchema = new mongoose.Schema({
    orgName: { type: String, required: true },
    orgEmail: { type: String, required: true, unique: true },
    orgPassword: { type: String, required: true }
});
const Organization = mongoose.model("Organization", orgSchema);

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated
    } else {
        res.status(401).send("Unauthorized: Please log in.");
    }
};

// ✅ API - Get User Profile
app.get('/get-user', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ ABHAID: req.session.userId });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('❌ Error fetching user data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// ✅ API - Update User Profile
app.post('/update-user', isAuthenticated, async (req, res) => {
    try {
        const { name, phno, email } = req.body;
        const user = await User.findOneAndUpdate(
            { ABHAID: req.session.userId },
            { name, phno, email },
            { new: true }
        );
        if (user) {
            res.status(200).send('Profile updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('❌ Error updating user data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// ✅ API - Logout User
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error during logout:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Logout successful');
        }
    });
});

// ✅ API - User Sign-Up
app.post("/sign_up", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        console.log("✅ User Registered Successfully");
        res.redirect("Frontpage.html");
    } catch (err) {
        console.error("❌ Error inserting user data:", err);
        if (err.code === 11000) {
            res.status(400).send("ABHA ID or email must be unique.");
        } else {
            res.status(500).send("Database Insertion Error");
        }
    }
});

// ✅ API - Organization Sign-Up
app.post("/sign_up_org", async (req, res) => {
    try {
        const { orgName, orgEmail, orgPassword } = req.body;
        const newOrg = new Organization({ orgName, orgEmail, orgPassword });

        await newOrg.save();
        console.log("✅ Organization Registered Successfully");
        res.redirect("Frontpage.html");
    } catch (err) {
        console.error("❌ Error inserting organization data:", err);
        if (err.code === 11000) {
            res.status(400).send("Organization email must be unique.");
        } else {
            res.status(500).send("Database Insertion Error");
        }
    }
});

// ✅ API - User Sign-In
app.post("/sign_in", async (req, res) => {
    const { ABHAID, password } = req.body;
    try {
        const user = await User.findOne({ ABHAID, password });
        if (user) {
            req.session.userId = user.ABHAID; // Store user ID in session
            console.log("✅ User Signed In Successfully");
            res.status(200).send("User Sign-In Successful");
        } else {
            console.log("❌ Invalid User Credentials");
            res.status(401).send("Invalid ABHA ID or Password");
        }
    } catch (err) {
        console.error("❌ Error during User Sign-In:", err);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ API - Organization Sign-In
app.post("/sign_in_org", async (req, res) => {
    const { orgEmail, orgPassword } = req.body;
    try {
        const organization = await Organization.findOne({ orgEmail, orgPassword });
        if (organization) {
            console.log("✅ Organization Signed In Successfully");
            res.status(200).send("Organization Sign-In Successful");
        } else {
            console.log("❌ Invalid Organization Credentials");
            res.status(401).send("Invalid Organization Credentials");
        }
    } catch (err) {
        console.error("❌ Error during Organization Sign-In:", err);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ API - Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    return res.redirect("Frontpage.html");
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
