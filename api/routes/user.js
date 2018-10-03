const express = require('express');
var request = require('request');
//express-router, a subpackage for managing different routes
const router = express.Router();
const mongoose = require('mongoose');

const User= require('../models/user')

router.post('/', (req, res, next) => {
	//Constructor for a new DB object
	const  user = new User({
		_id: new mongoose.Types.ObjectId(), //create new id
		email: req.body.email,
		password: req.body.password,
	});
	//send it to MongoDB
	user
		.save()
	    .then(result => {
	      console.log(result);
	      res.status(201).json({
	        message: "Handling POST requests to /users",
	        createdUser: result
	      });
	    })
	    .catch(err => {
	      console.log(err);
	      res.status(500).json({
	        error: err
	      });
	});
});

router.get('/:userID', (req, res, next) => {
	const id = req.params.userID;
	User.findById(id)
		.exec()
		.then(doc => {
			console.log(doc);
			//send response once I know it was actually successfull
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		});

});

module.exports = router;