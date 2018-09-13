var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('foods/index', { title: 'Foods Index' });
});

router.get('/:foodName', (req, res, next) => {
	var foodName = req.params.foodName;
	request('https://api.edamam.com/api/food-database/parser?ingr='+foodName+'&app_id=f43473b7&app_key=069735f1f34ba52c77f71b860808235f', function (error, response, body) {
	    if(response.statusCode == 404)
	    {
	    	res.json({ error: 'cannot connect to DB' });
	    }
	    else res.send(response)
	})
});



module.exports = router;
