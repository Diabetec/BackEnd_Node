const express = require('express');
var request = require('request');
var path = require('path');

//express-router, a subpackage for managing different routes
const router = express.Router();

/**
 * @api {get} /food/:foodName Retrieve food info
 * @apiName GetFoodInfo
 * @apiGroup Food
 *
 * @apiExample Example usage:
 *		localhost:3000/food/get/enchiladas suizas		
 * 
 * @apiParam {String} foodName Name of the searched food
 *
 * @apiSuccess {String} foodID food id in the remote DB
 * @apiSuccess {String} foodName  food label name
 * @apiSuccess {Number} calories  calories of the food
 * @apiSuccess {Number} carbs  carbs in the food
 * @apiSuccess {Number} proteins  proteins in the food
 * @apiSuccess {Number} fats  fats in the food
 *
 * @apiSuccessExample Success-Response:
 *		HTTP 200 OK
 *		{
 *			"data": [
 *				{
 *				"foodID":"food_bvxig6ybaomi9kbcp2gtea34kp1j",
 *				"foodName":"Enchiladas Suizas",
 *				"calories":166.02316602316603,
 *				"carbs":16.602316602316602,
 *				"proteins":5.019305019305019,
 *				"fats":8.880308880308881
 *				}
 *			],
 * 			"error": null
 *		}
 *
 * @apiErrorExample Error-Response:
 *     HTTP 404 Not Found
 *     {
 * 		 "data": null
 *       "error": "cannot connect to food-database"
 *     }
 */

 function getFoodData(foodName,callback){
	//  Callback responds with (data, error)
	request('https://api.edamam.com/api/food-database/parser?ingr='+foodName+'&app_id=f43473b7&app_key=069735f1f34ba52c77f71b860808235f', function (error, response, body) {
		if(response.statusCode == 404) callback(null, 'cannot connect to food-database');
	    else{
	    	var result = JSON.parse(response.body);
	    	var foodINFO = [];
	    	for (var i in result.hints)
	    	{
	    		foodINFO.push({
	    			foodID : result.hints[i].food.foodId,
		    		foodName : result.hints[i].food.label,
		    		calories : result.hints[i].food.nutrients.ENERC_KCAL,
					carbs : result.hints[i].food.nutrients.CHOCDF ? result.hints[i].food.nutrients.CHOCDF : 0,
		    		proteins : result.hints[i].food.nutrients.PROCNT ? result.hints[i].food.nutrients.PROCNT : 0,
		    		fats : result.hints[i].food.nutrients.FAT ? result.hints[i].food.nutrients.FAT : 0
		    		
	    		});
			}
			callback(foodINFO, null);
	    }
	})
 }

//define the complete URL (/api/routes/food(:foodName)) in app.js
router.get('/get/:foodName', (req, res, next) => {
	var foodName = req.params.foodName;
	getFoodData(foodName, (data, error) => {
		response = {data: data, error: error};
		if(error) res.status(404);
		res.send(response);
	});
});

router.get('/predict', (req, res, next) => {
	res.sendFile('index.html', { root: './flask_server' })
});

router.post('/predict', (req, res, next) => {
	// Acting as a proxy to sed data to flask_server
	req.pipe(request.post('http://localhost:5000/predict',null, (err, httpResponse, body) => {
		if(err) return res.sendStatus(500);
		data = JSON.parse(body);
		getFoodData(data['predictions'][0]['label'], (info, error) => {
			if(!error){
				data['predictions'][0]['info'] = info[0];
			}
			res.send(data);
		});
	}));
});

module.exports = router;