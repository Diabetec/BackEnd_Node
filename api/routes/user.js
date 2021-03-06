const express = require('express');
var request = require('request');
//express-router, a subpackage for managing different routes
const router = express.Router();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../middleware/config.json');
const User= require('../models/user')
const Ufood= require('../models/userfood')
const userService = require('../middleware/userService');

/**
 * @api {post} /user/signup Create new User
 * @apiName PostNewUser
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/signup
 *		Headers: Content-Type application/json
 *		Body
 *		{
 *			"email" : "email@gmail.com",
 *			"password" : "secret",
 *			"name" : "Liz",
 *			"age" : 22,
 *			"sex" : "mujer",
 *			"height" : 1.76,
 *			"weight" : 69.8
 *		}
 * 
 * @apiParam {String} email Client email - must be unique
 * @apiParam {String} password Client password
 * @apiParam {String} [name] Client's name
 * @apiParam {Number} [age] Client's age
 * @apiParam {Number} [sex] Client's sex
 * @apiParam {Number} [height] Client's height
 * @apiParam {Number} [weight] Client's weight
 *
 * @apiSuccess {String} _id return new user id
 * @apiSuccess {String} [name] Client's name (if exists)
 * @apiSuccess {String} [sex] Client's sex (if exists)
 * @apiSuccess {Number} [age]  Client's age (if exists)
 * @apiSuccess {Number} [height]  Client's height (if exists)
 * @apiSuccess {Number} [weight]  Client's weight (if exists)
 * @apiSuccess {String} email  Client's email
 * @apiSuccess {String} password  encrypted password
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 201 Created
 *		{
 *			"createdUser": 
 *			{
 *		        "_id": "5bc91d49b6245617546eeaf7",
 *		        "name": "Liz",
 *		        "age": 22,
 *		        "sex": "mujer",
 *		        "height": 1.76,
 *		        "weight": 69.8,
 *		        "email": "email3@gmail.com",
 *				"foods": [],
 *		        "password": "$2a$08$/8Wv2PV/CRcVWzNdsiKxwulclz4vOo8mAhKB3Biaa6P9dU1cHsi/.",
 *		        "__v": 0
 *			}
 *		}
 *
 * @apiErrorExample Error-Response:
 *		HTTP 500 Internal Server Error
 *		{
 *			"error": 
 *			{
 *				"driver": true,
 *				"name": "MongoError",
 *				"index": 0,
 *				"code": 11000,
 *				"errmsg": "E11000 duplicate key error collection: test.users index: email_1 dup key: { : \"email@gmail.com\" }"
 *			}
 *		}
 *
 */
router.post('/signup', (req, res, next) => {
	//Constructor for a new DB object
	const  user = new User({
		_id: new mongoose.Types.ObjectId(), //create new id
		name: req.body.name,
		age: req.body.age,
		sex: req.body.sex,
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

/**
 * @api {post} /login Retrieve User information
 * @apiName loginUser
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/login
 *		Headers: Content-Type application/json
 *		Body
 *		{
 *			"email" : "email@gmail.com",
 *			"password" : "secret"
 *		}
 *
 * @apiParam  {String} email registration email
 * @apiParam  {String} password corresponding password
 *
 * @apiSuccess {String} _id return new user id
 * @apiSuccess {String} email  Client's email
 * @apiSuccess {String} password  encrypted password
 * @apiSuccess {String} token  login auth token
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		{
 *			"_id": "5bb47b626271b813e0abbc44",
 *			"email": "hashed@gmail.com",
 *			"password": "$2a$08$sxTWAKHvK7it/aPbIxAPk.n506b5U7MiyxRRmwp9uisp3z/kJkje.",
 *			"__v": 0,
 *			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YmI0N2I2MjYyNzFiODEzZTBhYmJjNDQiLCJpYXQiOjE1NDMxODc2ODZ9.5yawf_wIYnGvLwLNxmpQklr2CObLfysFa0QW5tYhmAU"
 *		}
 *
 * @apiErrorExample Wrong Password:
 *		HTTP 400 Bad Request
 *		{
 *			"message": "Username or password is incorrect"
 *		}
 *
 * @apiErrorExample Wrong Params:
 *		HTTP 500 Internal Server error
 *		{
 *			"error" : {}
 *		}
 *
 */
router.post('/login', (req, res, next) => {
	userService.authenticate(req.body)
	    .then(user => 
	    	user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
	    .catch(err => next(err));
});

/**
 * @api {post} /history Add user's food
 * @apiName postHistory
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/history
 *		Authorization: Bearer Token {LOGIN_TOKEN}
 *		Headers: Content-Type application/json
 *		Body
 *		{
 *			"label":"enchiladas",
 *			"calories":10,
 *			"carbs":8,
 *			"fats":6,
 *			"proteins":7
 *		}
 *
 * @apiParam  {String} label name of selected dish
 * @apiParam  {Number} calories calories in dish
 * @apiParam  {Number} carbs carbs in dish
 * @apiParam  {Number} fats fats in dish
 * @apiParam  {Number} proteins proteins in dish
 *
 * @apiSuccess  {String} _id food's id in our DB
 * @apiSuccess  {Date} date food add date
 * @apiSuccess  {String} label food name
 * @apiSuccess  {Number} calories calories in dish
 * @apiSuccess  {Number} carbs carbs in dish
 * @apiSuccess  {Number} fats fats in dish
 * @apiSuccess  {Number} proteins proteins in dish
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		{
 *			"message": "New food added to history",
 *			"food": {
 *				"_id": "5bfb3360f0421b08749acec0",
 *				"date": "2018-11-25T23:42:24.131Z",
 *				"label": "Enchiladas suizas con pollo",
 *				"calories": 10,
 *				"carbs": 8,
 *				"fats": 6,
 *				"proteins": 7,
 *				"__v": 0
 *			}
 *		}
 *
 *
 * @apiErrorExample Wrong Params:
 *		HTTP 500 Internal Server error
 *		{
 *			"error" : {}
 *		}
 *
 */
router.post('/history/:userID', (req, res, next) => {
	const userId = req.params.userID;
	const  ufood = new Ufood({
		_id: new mongoose.Types.ObjectId(), //create new id
		date: new Date(),
		//image : ?????????????
		label: req.body.label,
		calories: req.body.calories ? req.body.calories : 0,
		carbs: req.body.carbs ? req.body.carbs : 0,
		fats: req.body.fats ? req.body.fats : 0,
		proteins: req.body.proteins ? req.body.proteins : 0
	});

	//send it to MongoDB
	User.update({ _id: userId }, { $push: { foods : ufood }})
	.exec()
	.then(result => {
	  console.log(result);
	  res.status(200).json(ufood);
	})
	.catch(err => {
	  console.log(err);
	  res.status(500).json({
	    error: err
	  });
	});
});

/**
 * @api {get} /history get user's food from specific day
 * @apiName postHistory
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/history?userID={id}&year={year}&month={month}&day={day}
 *		Authorization: Bearer Token {LOGIN_TOKEN}
 *		Headers: Content-Type application/json
 *
 *		userID = 5bb47b626271b813e0abbc44
 *		year = 2018
 *		month = 08
 *		day = 21
 *
 * @apiParam  {String} userID user id
 * @apiParam  {String} year searched year
 * @apiParam  {String} month searched month
 * @apiParam  {String} day searched day
 *
 * @apiSuccess  {String} _id food's id in our DB
 * @apiSuccess  {Date} date food add date
 * @apiSuccess  {String} label food name
 * @apiSuccess  {Number} calories calories in dish
 * @apiSuccess  {Number} carbs carbs in dish
 * @apiSuccess  {Number} fats fats in dish
 * @apiSuccess  {Number} proteins proteins in dish
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		[
 *			"food": {
 *				"_id": "5bfb3360f0421b08749acec0",
 *				"date": "2018-11-25T23:42:24.131Z",
 *				"label": "Enchiladas suizas con pollo",
 *				"calories": 10,
 *				"carbs": 8,
 *				"fats": 6,
 *				"proteins": 7,
 *				"__v": 0
 *			},
  *			"food": {
 *				"_id": "5bfb3360f0421b08749acecb",
 *				"date": "2018-11-25T23:42:24.131Z",
 *				"label": "Quesadillas",
 *				"calories": 10,
 *				"carbs": 8,
 *				"fats": 6,
 *				"proteins": 7,
 *				"__v": 0
 *			}
 *		]
 *
 * @apiErrorExample Not Found Error:
 *		HTTP 404 Not Found
 *		{
 *			"message": "No valid entry found for provided date"
 *		}
 *
 * @apiErrorExample Wrong Params:
 *		HTTP 500 Internal Server error
 *		{
 *			"error" : {}
 *		}
 *
 */
router.get('/history', (req, res, next) => {
	// YYYY,MM,DD
	//const userId = mongoose.Types.ObjectId(req.query.userID);
	const userId = req.query.userID;
	const year = req.query.year;
	const month = req.query.month;
	const day = req.query.day;
	const dayStart = new Date(new Date(new Date(year, month-1, day).setDate(new Date(year, month-1, day).getDate(year, month-1, day)-1)).setHours(00,00,00));
	const dayEnd = new Date(new Date(new Date(year, month-1, day).setDate(new Date(year, month-1, day).getDate(year, month-1, day))).setHours(00,00,00));
	//User.find({ _id: userId, "foods.date":{"$gte": new Date(year, month, day)}})
	User.findOne({ _id: userId, "foods.date":{"$lt":dayEnd, "$gte": dayStart}})
		.exec()
		.then(result => {
			//send response once I know it was actually successfull
			if (result) {
				console.log(result.foods);
				res.status(200).json(result.foods);
		    } else {
		        res
		          .status(404)
		          .json({ message: "No valid entry found for provided date" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		});
});


/**
 * @api {get} /user/:userID Retrieve User information
 * @apiName getUserInfo
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/5bc91d49b6245617546eeaf7
 *
 *		Authorization: Bearer Token {LOGIN_TOKEN}
 * 
 * @apiParam  {String} userId user ID in DB 
 *
 * @apiSuccess {String} _id return new user id
 * @apiSuccess {String} [name] Client's name (if exists)
 * @apiSuccess {Number} [age]  Client's age (if exists)
 * @apiSuccess {Number} [height]  Client's height (if exists)
 * @apiSuccess {Number} [weight]  Client's weight (if exists)
 * @apiSuccess {String} email  Client's email
 * @apiSuccess {String} password  encrypted password
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 Ok
 *		{
 *			"_id": "5bc91d49b6245617546eeaf7",
 *			"name": "Liz",
 *			"age": 22,
 *			"height": 1.76,
 *			"weight": 69.8,
 *			"email": "email3@gmail.com",
 *			"password": "$2a$08$/8Wv2PV/CRcVWzNdsiKxwulclz4vOo8mAhKB3Biaa6P9dU1cHsi/.",
 *			"foods": 
 *			[
 *				{
 *					"_id": "5bfb4b8ec9f0d61ac88ecbfb",
 *					"date": "2018-11-26T01:25:34.754Z",
 *					"label": "enchilada",
 *					"calories": 10,
 *					"carbs": 8,
 *					"fats": 6,
 *					"proteins": 7
 *				}
 *			]
 *
 * @apiErrorExample Not Found Error:
 *		HTTP 404 Not Found
 *		{
 *			"message": "No valid entry found for provided ID"
 *		}
 *
 * @apiErrorExample Server Error:
 *		HTTP 500 Internal Server Error
 *		{
 *			"error": 
 *			{
 *				"driver": true,
 *				"name": "MongoError",
 *				"index": 0,
 *				"code": 8000,
 *				"errmsg": "AtlasError" }"
 *			}
 *		}
 */
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

/**
 * @api {patch} /user/:userID Modify User information
 * @apiName patchUser
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/5bc91d49b6245617546eeaf7
 *		Authorization: Bearer Token {LOGIN_TOKEN}
 *		Headers: Content-Type application/json
 *		Body
 *		[
 *			{ "propName" : "name", "value" : "Lizzie" },
 *			{ "propName" : "age", "value" : "21" }
 *		]
 *
 * @apiParam  {String} userId user ID in DB 
 * @apiParam  {String} [name] Client's name change
 * @apiParam  {Number} [age]  Client's age update
 * @apiParam  {Number} [height]  Client's height update
 * @apiParam  {Number} [weight]  Client's weight update
 * @apiParam  {String} [email]  Client's new email
 * @apiParam  {String} [password]  new password
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		{
 *		    "n": 1,
 *		    "nModified": 2,
 *		    "opTime": {
 *		        "ts": "6613896211571146755",
 *		        "t": 2
 *		    },
 *		    "electionId": "7fffffff0000000000000002",
 *		    "ok": 1,
 *		    "operationTime": "6613896211571146755",
 *		    "$clusterTime": {
 *		        "clusterTime": "6613896211571146755",
 *		        "signature": {
 *		            "hash": "8oB2tdST5YSYN2ooQkgPibOy+GY=",
 *		            "keyId": "6602994794299916289"
 *		        }
 *		    }
 *		}
 *
 *	@apiErrorExample Not Found Error:
 *		HTTP 404 Not Found
 *		{
 *			"message": "No valid entry found for provided ID"
 *		}
 *
 * @apiErrorExample Server Error:
 *		HTTP 500 Internal Server Error
 *		{
 *			"error": 
 *			{
 *				"driver": true,
 *				"name": "MongoError",
 *				"index": 0,
 *				"code": 8000,
 *				"errmsg": "AtlasError" }"
 *			}
 *		}
 */
router.patch('/:userID', (req, res, next) => {
	const  user = new User();
	const id = req.params.userID;
	const updateOps = {};
	for (const ops of req.body) {
		if (ops.propName == "password")
		{
			updateOps[ops.propName] = user.generateHash(ops.value);
		}
		else
		{
			updateOps[ops.propName] = ops.value;
		}
	}
	console.log(updateOps);
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

/**
 * @api {delete} /user/:userID Delete User
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/5bc91d49b6245617546eeaf7
 *
 *		Authorization: Bearer Token {LOGIN_TOKEN}
 *
 * @apiParam  {String} userId user ID in DB 
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		{
 *		    "n": 1,
 *		    "opTime": {
 *		        "ts": "6613896211571146755",
 *		        "t": 2
 *		    },
 *		    "electionId": "7fffffff0000000000000002",
 *		    "ok": 1,
 *		    "operationTime": "6613896211571146755",
 *		    "$clusterTime": {
 *		        "clusterTime": "6613896211571146755",
 *		        "signature": {
 *		            "hash": "8oB2tdST5YSYN2ooQkgPibOy+GY=",
 *		            "keyId": "6602994794299916289"
 *		        }
 *		    }
 *		}
 *
 * @apiErrorExample Server Error:
 *		HTTP 500 Internal Server Error
 *		{
 *			"error": 
 *			{
 *				"driver": true,
 *				"name": "MongoError",
 *				"index": 0,
 *				"code": 8000,
 *				"errmsg": "AtlasError" }"
 *			}
 *		}
 */
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
