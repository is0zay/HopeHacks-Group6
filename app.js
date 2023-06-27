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
const axios = require('axios');

const connection = mysql.createConnection({
	host:"sql9.freesqldatabase.com",
	user:"sql9628983",
	password:"JaGCwHUKhZ",
	database:"sql9628983"
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
	
	// try {
	// 	const { issue } = req.query;
	// 	const url = `https://news-api14.p.rapidapi.com/search?q=${issue}&country=us&language=en&pageSize=7&from=2023-01-01`;
	// 	const options = {
	// 	  method: 'GET',
	// 	  headers: {
	// 		'x-rapidapi-subscription': 'basic',
	// 		'x-rapidapi-proxy-secret': 'c02cea90-4588-11eb-add9-c577b8ecdc8e',
	// 		'x-rapidapi-user': 'suprikurniyanto',
	// 		'X-RapidAPI-Key': '736b426570msh3e3bea3a2046199p10b6ccjsne1a147f2cefb',
	// 		'X-RapidAPI-Host': 'news-api14.p.rapidapi.com',
	// 	  },
	// 	};
	
	// 	const response = await fetch(url, options);
	// 	const data = await response.json();
	// 	console.log(data);
	// 	res.render('news-search', { articles: data.articles });
	//   } catch (error) {
	// 	console.error(error);
	// 	res.status(500).json({ error: 'An error occurred.' });
	//   }

	const { issue } = req.query;
	const options = {
	method: 'GET',
	url: 'https://news-api14.p.rapidapi.com/search',
	params: {
		q: `${issue}`,
		country: 'us',
		language: 'en',
		pageSize: '10',
		from: '2022-06-01'
	},
	headers: {
		'x-rapidapi-subscription': 'ultra',
		'x-rapidapi-proxy-secret': 'c02cea90-4588-11eb-add9-c577b8ecdc8e',
		'x-rapidapi-user': 'suprikurniyanto',
		'X-RapidAPI-Key': '736b426570msh3e3bea3a2046199p10b6ccjsne1a147f2cefb',
		'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
	}
	};

	try {
		const response = await axios.request(options);

		res.render('news-search', { articles: response.data.articles });
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}

});

// SECOND THIRD PARTY API TO SEARCH FOR NONPROFIT ORGANIZATIONS
// GET InPUT FROM HTML FORM
app.get('/submitsupport', (req, res) => {
	// const apiKey = 'pk_live_86a419192b705c472ffaeceac186383f';
	// const { issue } = req.query;
	// const url = `https://partners.every.org/v0.2/browse/${issue}?apiKey=${apiKey}`;
	// console.log(issue);
  
	// fetch(url)
	//   .then(response => response.json())
	//   .then(data => {
		
	// 	console.log(data)
	// 	res.render('nonprofit', {content:data.nonprofits})
	// })
	//   .catch(error => res.status(500).json({ error: 'An error occurred.' }));

	const apiKey = 'pk_live_86a419192b705c472ffaeceac186383f';
	const { issue } = req.query;
	const url = `https://partners.every.org/v0.2/browse/${issue}?apiKey=${apiKey}`;
	console.log(issue);

	axios.get(url)
	.then(response => {
		const data = response.data;
		console.log(data);
		res.render('nonprofit', { content: data.nonprofits });
	})
	.catch(error => res.status(500).json({ error: 'An error occurred.' }));

});

// FIRST PARTY API FOR NEWSLETTER REGISTRATION

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'hope4change27@gmail.com',
	  pass: 'mgoycwixltslbokq',
	},
  });
  
  
  
  app.post('/subscribe', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
  
	  // Send confirmation email
	  const mailOptions = {
		from: 'hope4change27@gmail.com',
		to: email,
		subject: 'Newsletter Subscription Confirmation',
		text: `Dear ${firstName} ${lastName},\n\nThank you for subscribing to our newsletter!`,
	  };
	
	  transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
		  console.error(error);
		  res.send('An error occurred while subscribing.');
		} else {
		  console.log('Email sent: ' + info.response);
		  res.send('Thank you for subscribing!');
		}
	  });
  
  
	// Store subscriber data in the database
	connection.query(
	  'INSERT INTO subscribers (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
	  [firstName, lastName, email, password],
	  (error, results) => {
		if (error) {
		  console.error(error);
		  res.render('newsletter2', { message: 'An error occurred while subscribing.' });
		} else {
		  res.render('newsletter2', { message: `Hello ${req.body.firstName}! Thank you for subscribing!` });
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
