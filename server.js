const express = require('express');
const axios = require('axios');
const http = require('http');
const cors = require('cors');
const app = express();

app.use(cors());

const server = http.createServer(app);

app.get('/isallowed/0', (request, response) => {
	console.log('recieved isallowed/0 request from webapp');

	let success = false;
	let errorMessage = null;

	axios.get('https://5333-14-139-226-226.ngrok.io/isallowed/0')
		.then((response) => {
			console.log('recieved ', response.data, ' from hardware');
			success = true;
		})
		.catch((error) => {
			console.log(error);
			errorMessage = error.message;
		})

		if (success) {
			response.send('access was denied');
		} else {
			response.send('error: ', errorMessage);
		}
})

app.get('/isallowed/1', (request, response) => {
	console.log('recieved isallowed/1 request from webapp');

	let success = false;
	let errorMessage = null;

	axios.get('https://5333-14-139-226-226.ngrok.io/isallowed/1')
	.then((response) => {
		console.log('recieved ', response.data, ' from hardware');
		success = true;
	})
	.catch((error) => {
		console.log(error);
		errorMessage = error.message;
	})

	if (success) {
		response.send('access was granted');
	} else {
		response.send('error: ', errorMessage);
	}
})

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`server is running on port ${port}`));