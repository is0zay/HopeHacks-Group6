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

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'hope4changeemail@yahoo.com',
    pass: 'HopeHacks6!',
  },
});

app.use(express.static("public"));
// using body parser to get user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//template engine
app.set('view engine', 'ejs');
app.set("views", "./src/views");

app.post('/subscribe', (req, res) => {
  const { email, password } = req.body;

  // Store subscriber data in the database
  connection.query(
    'INSERT INTO newsletterData (email, password) VALUES (?, ?)',
    [email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.send('An error occurred while subscribing.');
      } else {
        // Send confirmation email
        const mailOptions = {
          from: 'hope4changeemail@yahoo.com',
          to: email,
          subject: 'Newsletter Subscription Confirmation',
          text: 'You have successfully subscribed to our newsletter.',
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.send('Thank you for subscribing!');
      }
    }
  );
});

app.post('/unsubscribe', (req, res) => {
  const { email } = req.body;

  // Remove subscriber data from the database
  connection.query(
    'DELETE FROM newsletterData WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.error(error);
        res.send('An error occurred while unsubscribing.');
      } else {
        res.send('You have been unsubscribed successfully.');
      }
    }
  );
});


app.get("/support", (req,res) => {
	res.render("support")
})
app.get("/", (req,res) => {
	res.render("index")
})
app.get("/newsletter", (req,res) => {
	res.render("newsletter")
})

// app.get('/search', (req, res) => {
//   const options = {
//     method: 'GET',
//     hostname: 'google-news-api1.p.rapidapi.com',
//     port: null,
//     path: '/search?language=EN&q=immigration',
//     headers: {
//       'X-RapidAPI-Key': 'f0f9c103b4mshf65c80b6eab160fp1e155ajsna30f5f819cb6',
//       'X-RapidAPI-Host': 'google-news-api1.p.rapidapi.com'
//     }
//   };

//   const apiRequest = https.request(options, (apiResponse) => {
//     const chunks = [];

//     apiResponse.on('data', (chunk) => {
//       chunks.push(chunk);
//     });

//     apiResponse.on('end', () => {
//       const body = Buffer.concat(chunks);
//       res.send(body.toString());
		
//     });

// 	console.log(chunks);
//   });

//   apiRequest.on('error', (error) => {
//     console.error(error);
//     res.status(500).send('An error occurred');
//   });

 

//   apiRequest.end();
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
