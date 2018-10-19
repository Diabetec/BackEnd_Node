const express = require('express');
var request = require('request');

//express-router, a subpackage for managing different routes
const router = express.Router();

/**
 * @api {get} /food/:foodName Retrieve food info
 * @apiName GetFoodInfo
 * @apiGroup Food
 *
 * @apiExample Example usage:
 *		localhost:3000/food/enchiladas suizas		
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
 *		[
 *			{
 *				"foodID":"food_bvxig6ybaomi9kbcp2gtea34kp1j",
 *				"foodName":"Enchiladas Suizas",
 *				"calories":166.02316602316603,
 *				"carbs":16.602316602316602,
 *				"proteins":5.019305019305019,
 *				"fats":8.880308880308881
 *			}
 *		]
 *
 * @apiErrorExample Error-Response:
 *     HTTP 404 Not Found
 *     {
 *       "error": "cannot connect to food-database"
 *     }
 */

//define the complete URL (/api/routes/food(:foodName)) in app.js
router.get('/:foodName', (req, res, next) => {
	var foodName = req.params.foodName;
	request('https://api.edamam.com/api/food-database/parser?ingr='+foodName+'&app_id=f43473b7&app_key=069735f1f34ba52c77f71b860808235f', function (error, response, body) {
	    if(response.statusCode == 404)
	    {
	    	res.json({ error: 'cannot connect to food-database' });
	    }
	    else //res.send(response.body)
	    	//https://stackoverflow.com/questions/23731869/find-items-from-json-array-using-nodejs
	    {
	    	var result = JSON.parse(response.body);
	    	//res.send(result.hints[0].food.label);
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
		    		//measure URI
	    		});
	    	}
	    	res.send(JSON.stringify(foodINFO));
	    }
	})
});

module.exports = router;