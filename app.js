const express = require('express');
const https = require('https');
let ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
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
