const express = require('express');
const https = require('https');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const path = require('path');

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

app.get('/about', (req,res) => {
	res.render('about')
});

app.get('/nonprofits', (req, res) => {
	const apiKey = 'pk_live_86a419192b705c472ffaeceac186383f';
	const searchTerm = req.query.searchTerm;
	const url = `https://partners.every.org/v0.2/browse/lgbt?apiKey=${apiKey}`;
  
	fetch(url)
	  .then(response => response.json())
	  .then(data => {
		
		console.log(data.nonprofits)
		res.render('nonprofit', {content:data.nonprofits})
	})
	  .catch(error => res.status(500).json({ error: 'An error occurred.' }));
  });


// USE html form to search for news
app.get('/newssearch', (req, res) => {
	const { issue } = req.query;
	console.log(issue);
  
	const options = {
	  method: 'GET',
	  hostname: 'news-api14.p.rapidapi.com',
	  port: null,
	  path: `/search?q=${issue}&country=us&language=en&pageSize=7&from=2023-01-01`,
	  headers: {
		'x-rapidapi-subscription': 'basic',
		'x-rapidapi-proxy-secret': 'c02cea90-4588-11eb-add9-c577b8ecdc8e',
		'x-rapidapi-user': 'suprikurniyanto',
		'X-RapidAPI-Key': 'f0f9c103b4mshf65c80b6eab160fp1e155ajsna30f5f819cb6',
		'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
	  }
	};
  
	const apiRequest = https.request(options, (apiResponse) => {
	  const chunks = [];
  
	  apiResponse.on('data', (chunk) => {
		chunks.push(chunk);
	  });
  
	  apiResponse.on('end', () => {
		const body = Buffer.concat(chunks);
		const newsResults = JSON.parse(body.toString());
		const newsArticles = newsResults.articles;
  
		res.render('news-search', { articles: newsArticles });
	  });
	});
  
	apiRequest.on('error', (error) => {
	  console.error(error);
	  res.status(500).send('An error occurred');
	});
  
	apiRequest.end();
  });



app.get('/search', (req, res) => {
  const options = {
    method: 'GET',
    hostname: 'news-api14.p.rapidapi.com',
    port: null,
    path: '/search?q=racism&country=us&language=en&pageSize=7&from=2023-01-01',
    headers: {
		'x-rapidapi-subscription': 'basic',
		'x-rapidapi-proxy-secret': 'c02cea90-4588-11eb-add9-c577b8ecdc8e',
		'x-rapidapi-user': 'suprikurniyanto',
		'X-RapidAPI-Key': 'f0f9c103b4mshf65c80b6eab160fp1e155ajsna30f5f819cb6',
		'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
    }
  };

  const apiRequest = https.request(options, (apiResponse) => {
    const chunks = [];

    apiResponse.on('data', (chunk) => {
      chunks.push(chunk);
    });

    apiResponse.on('end', () => {
      const body = Buffer.concat(chunks);
	  const newsResults = JSON.parse(body.toString());
      const newsArticles = newsResults.articles;
	
	  res.render('news-search', {articles: newsArticles});
    });
  });

  apiRequest.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred');
  });

 

  apiRequest.end();
});

// app.get('/news', (req, res) => {
// 	const options = {
// 	  method: 'GET',
// 	  hostname: 'google-news-api1.p.rapidapi.com',
// 	  port: null,
// 	  path: '/search?language=EN&q=racism&required_props=title%2Cimage&limit=10',
// 	  headers: {
// 		'X-RapidAPI-Key': 'f0f9c103b4mshf65c80b6eab160fp1e155ajsna30f5f819cb6',
// 		'X-RapidAPI-Host': 'google-news-api1.p.rapidapi.com'
// 	  }
// 	};
  
// 	const request = https.request(options, (response) => {
// 	  let responseData = '';
  
// 	  response.on('data', (chunk) => {
// 		responseData += chunk;
// 	  });

  
// 	  response.on('end', () => {
// 		console.log(responseData);
// 		res.status(200).send(responseData);
// 	  });
// 	});
  
// 	request.on('error', (error) => {
// 	  console.error(error);
// 	  res.status(500).json({ error: 'Internal Server Error' });
// 	});
  
// 	request.end();
//   });

// seting up routes
  
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
