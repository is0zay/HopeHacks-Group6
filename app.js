const express = require('express');
const https = require('https');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"HopeHacksNews",
})

app.use(express.static("public"));
// using body parser to get user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//template engine
app.set('view engine', 'ejs');
app.set("views", "./src/views");




app.get("/support", (req,res) => {
	res.render("support")
})
app.get("/", (req,res) => {
	res.render("index")
})
app.get("/newsletter", (req,res) => {
	res.render("newsletter")
})

app.post('/subscribe', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Store subscriber data in the database
  connection.query(
    'INSERT INTO subscribers (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.render('newsletter2', { message: 'An error occurred while subscribing.' });
      } else {
        res.render('newsletter2', { message: 'Thank you for subscribing!' });
      }
    }
  );
});

app.post('/unsubscribe', (req, res) => {
  const { email, password } = req.body;

  // Remove subscriber data from the database
  connection.query(
    'DELETE FROM subscribers WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.render('newsletter2', { message: 'An error occurred while unsubscribing.' });
      } else if (results.affectedRows === 0) {
        res.render('newsletter2', { message: 'Invalid email or password.' });
      } else {
        res.render('newsletter2', { message: 'You have been unsubscribed successfully.' });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
