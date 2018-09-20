//Functionality package for http
const http = require('http');
const app = require('./app');

//This is HARDCODED but it should be defined as an environment variable
const port = process.env.PORT || 3000;

/*Creating a server pasing a Listener: function that is executed
 whenever it gets a request and returns a response */
const server = http.createServer(app);

//Starts the server
server.listen(port);