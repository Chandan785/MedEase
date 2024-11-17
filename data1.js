const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medical_details', // Your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database.');
    }
});

// User Sign-Up Endpoint
app.post('/api/signup/user', (req, res) => {
    const { name, abhaId, contact, email, password } = req.body;

    const query = 'INSERT INTO users (name, abha_id, contact, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, abhaId, contact, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send({ message: 'Error signing up user' });
        }
        res.send({ message: 'User signed up successfully' });
    });
});

// Organization Sign-Up Endpoint
app.post('/api/signup/org', (req, res) => {
    const { name, email, password } = req.body;

    const query = 'INSERT INTO organizations (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting organization:', err);
            return res.status(500).send({ message: 'Error signing up organization' });
        }
        res.send({ message: 'Organization signed up successfully' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
