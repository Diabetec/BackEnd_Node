require('dotenv').config();
const express = require('express');
const app = express();
//Middleware for login
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const foodRoute = require('./api/routes/food');
const userRoute = require('./api/routes/user');



//AVOID USING HARDCODED password. Defining it as an env var
mongoose.connect('mongodb+srv://lizwolf:JNhwAyBR1Mv78TW2@cluster0-s7mpd.mongodb.net/test?retryWrites=true',
	{ useNewUrlParser: true }
	);

//dev format for the output
app.use(morgan('dev'));
//parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Avoid CORS error (success because client & server are in the same place)
app.use((req, res, next) => {
	//Any origin(client) can have access
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
    "Access-Control-Allow-Headers",
    //Apended headers for the request
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  	);
  	//method is a property of the http request.
  	//in this case, the browser will send an options request
	if (req.method === "OPTIONS") {
		//additional header
		res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	    return res.status(200).json({});
	}
	//forward to the other middleware
	next();
});


//Passport COnfig
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

/*USE sets a middleware, which could be a function that 
returns a response*/
app.use('/food', foodRoute);
app.use('/user', userRoute);
//app.use('/userfood?', userRoute);

//If any request gets to this point, return an error message.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Handle all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;


/*
BODY PARSER
https://www.youtube.com/watch?v=zoSJ3bNGPp0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=5


*/