const express = require('express');
var request = require('request');

//express-router, a subpackage for managing different routes
const router = express.Router();

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling Post'
	});
});

router.get('/:userID', (req, res, next) => {
	res.status(200).json({
		message: 'Handling userID'
	});
});

router.get('/meal', (req, res, next) => {
	res.status(200).json({
		message: 'Handling Meal'
	});
});

module.exports = router;