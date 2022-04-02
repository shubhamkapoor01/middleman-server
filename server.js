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

	axios.get('https://6ee4-14-139-226-226.ngrok.io/isallowed/0')
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

	let mask = false;
	let success = false;
	let errorMessage8266 = null;
	let errorMessageMask = null;

	// ESP 8266 NGROK LINK UPDATE HERE
	axios.get('https://6ee4-14-139-226-226.ngrok.io/isallowed/1')
		.then((response) => {
			console.log('recieved ', response.data, ' from hardware');
			success = true;
		})
		.catch((error) => {
			console.log(error);
			errorMessage8266 = error.message;
		})
	
	// ESP32 NGROK LINK UPDATE IN ML SERVER
	// ML SERVER NGROK LINK UPDATE HERE 
	axios.get('https://7cc1-103-225-191-74.ngrok.io/predict')
		.then((response) => {
			console.log(response.data);
			if (response.data.response === 'Mask') {
				mask = true;
			} else {
				axios.get('https://access-verification-system.herokuapp.com/hasmask/0')
					.then((response) => {
						console.log('sent No Mask to webapp backend');
						console.log(response.data);
					})
					.catch((error) => {
						console.log('error in sending No Mask to webapp backend: ', error.message);
					})
			}
		})
		.catch((error) => {
			console.log(error);
			errorMessageMask = error.message;
		})

	if (success && mask) {
		response.send('access was granted and mask detected');
	} else if (success && !mask) {
		response.send('access was denied and mask not detected');
	} else {
		response.send('error: ', errorMessage);
	}
})

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`server is running on port ${port}`));
