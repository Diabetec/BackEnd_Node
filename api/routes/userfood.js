const express = require('express');
var request = require('request');
//express-router, a subpackage for managing different routes
const router = express.Router();
const mongoose = require('mongoose');

const Ufood= require('../models/userfood')

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
 *			"height" : 1.76,
 *			"weight" : 69.8
 *		}
 * 
 * @apiParam {String} email Client email - must be unique
 * @apiParam {String} password Client password
 * @apiParam {String} [name] Client's name
 * @apiParam {Number} [age] Client's age
 * @apiParam {Number} [height] Client's height
 * @apiParam {Number} [weight] Client's weight
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
 *		HTTP 201 Created
 *		{
 *			"createdUser": 
 *			{
 *		        "_id": "5bc91d49b6245617546eeaf7",
 *		        "name": "Liz",
 *		        "age": 22,
 *		        "height": 1.76,
 *		        "weight": 69.8,
 *		        "email": "email3@gmail.com",
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
 */
router.post('/history', (req, res, next) => {
	//Constructor for a new DB object
	const  user = new User({
		_id: new mongoose.Types.ObjectId(), //create new id
		date: req.body.date,
		image: req.body.image,
		label: req.body.label,
		calories: req.body.calories,
		carbs: req.body.carbs,
		fats: req.body.fats,
		proteins: req.body.proteins
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
 * @api {get} /user/:userID Retrieve User information
 * @apiName getUserInfo
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/5bc91d49b6245617546eeaf7
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
 *		HTTP 201 Created
 *		{
 *			"_id": "5bc91d49b6245617546eeaf7",
 *			"name": "Liz",
 *			"age": 22,
 *			"height": 1.76,
 *			"weight": 69.8,
 *			"email": "email3@gmail.com",
 *			"password": "$2a$08$/8Wv2PV/CRcVWzNdsiKxwulclz4vOo8mAhKB3Biaa6P9dU1cHsi/."
 *		}
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

/**
 * @api {delete} /user/:userID Delete User
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiExample {JSON} Example usage:
 *		localhost:3000/user/5bc91d49b6245617546eeaf7
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
