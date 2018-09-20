const express = require('express');
var request = require('request');

//express-router, a subpackage for managing different routes
const router = express.Router();

//define the complete URL (/api/routes/food(:foodName)) in app.js
router.get('/:foodName', (req, res, next) => {
	var foodName = req.params.foodName;
	request('https://api.edamam.com/api/food-database/parser?ingr='+foodName+'&app_id=f43473b7&app_key=069735f1f34ba52c77f71b860808235f', function (error, response, body) {
	    if(response.statusCode == 404)
	    {
	    	res.json({ error: 'cannot connect to food-database' });
	    }
	    else res.send(response.body)
	    	//https://stackoverflow.com/questions/23731869/find-items-from-json-array-using-nodejs
	})
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling Post'
	});
});

module.exports = router;