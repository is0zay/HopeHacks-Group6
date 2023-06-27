const express = require('express');
const https = require('https');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const { response } = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"password",
	database:"HopeHacksNews",
});

app.use(express.static("public"));
// using body parser to get user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//template engine
app.set('view engine', 'ejs');
app.set("views", "./src/views");


app.get("/", (req,res) => {
	res.render("index")
});

app.get("/support", (req,res) => {
	res.render('support')
});

app.get('/about', (req,res) => {
	res.render('about')
});

app.get('/newsletter', (req,res) => {
	res.render('newsletter')
});



// FIRST THIRD PARTY API TO SEARCH FOR NEWS
// USE html form to search for news
app.get('/newssearch', async (req, res) => {
	
	try {
		const { issue } = req.query;
		const url = `https://news-api14.p.rapidapi.com/search?q=${issue}&country=us&language=en&pageSize=7&from=2023-01-01`;
		const options = {
		  method: 'GET',
		  headers: {
			'x-rapidapi-subscription': 'basic',
			'x-rapidapi-proxy-secret': 'c02cea90-4588-11eb-add9-c577b8ecdc8e',
			'x-rapidapi-user': 'suprikurniyanto',
			'X-RapidAPI-Key': '736b426570msh3e3bea3a2046199p10b6ccjsne1a147f2cefb',
			'X-RapidAPI-Host': 'news-api14.p.rapidapi.com',
		  },
		};
	
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(data);
		res.render('news-search', { articles: data.articles });
	  } catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred.' });
	  }

});

// SECOND THIRD PARTY API TO SEARCH FOR NONPROFIT ORGANIZATIONS
// GET InPUT FROM HTML FORM
app.get('/submitsupport', (req, res) => {
	const apiKey = 'pk_live_86a419192b705c472ffaeceac186383f';
	const { issue } = req.query;
	const url = `https://partners.every.org/v0.2/browse/${issue}?apiKey=${apiKey}`;
	console.log(issue);
  
	fetch(url)
	  .then(response => response.json())
	  .then(data => {
		
		console.log(data)
		res.render('nonprofit', {content:data.nonprofits})
	})
	  .catch(error => res.status(500).json({ error: 'An error occurred.' }));
});

// FIRST PARTY API FOR NEWSLETTER REGISTRATION
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
		  res.render('newsletter2', { message: `Thank ${req.body.firstName} you for subscribing!` });
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
