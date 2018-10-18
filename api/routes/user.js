const express = require('express');
var request = require('request');
//express-router, a subpackage for managing different routes
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

const User= require('../models/user')

router.post('/signup', (req, res, next) => {
	//Constructor for a new DB object
	const  user = new User({
		_id: new mongoose.Types.ObjectId(), //create new id
		name: req.body.name,
		age: req.body.age,
		height: req.body.height,
		weight: req.body.weight,
		email: req.body.email
	});

	user.password = user.generateHash(req.body.password);
	//send it to MongoDB
	user
		.save()
	    .then(result => {
	      console.log(result);
	      res.status(201).json({
	        message: "New user created",
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

router.post('/login', (req, res, next) => {
	passport.

	//send it to MongoDB
	user
		.save()
	    .then(result => {
	      console.log(result);
	      res.status(201).json({
	        message: "New user created",
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
			if (doc) {
				res.status(200).json(doc);
		    } else {
		        res
		          .status(404)
		          .json({ message: "No valid entry found for provided ID" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		});
});


router.patch('/:userID', (req, res, next) => {
	const  user = new User();
	const id = req.params.userID;
	const updateOps = {};
	for (const ops of req.body) {
		if (ops.propName = "password")
		{
			updateOps[ops.propName] = user.generateHash(ops.value);
		}
		else
		{
			updateOps[ops.propName] = ops.value;
		}
	}
	User.update({ _id: id }, { $set: updateOps })
	.exec()
	.then(result => {
	  console.log(result);
	  res.status(200).json(result);
	})
	.catch(err => {
	  console.log(err);
	  res.status(500).json({
	    error: err
	  });
	});
});


router.delete('/:userID', (req, res, next) => {
	const id = req.params.userID;
	User.remove({ _id: id })
		.exec()
    	.then(result => {
	      res.status(200).json(result);
	    })
    	.catch(err => {
	      console.log(err);
	      res.status(500).json({
	        error: err
	      });
		});
});

module.exports = router;