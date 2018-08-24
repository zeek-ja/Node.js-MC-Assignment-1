/**
 * Node.js Master class assignment 1
 * Hello, by Joe
 */

 // // Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Define handlers
var handlers = {};

// Hello
handlers.hello = function(data, callback){
    callback(200, {'message' : 'Welcome... to my home.'});
};

// Not found
handlers.notFound = function(data, callback){
    callback(404, {'message' : 'Try the red pill.'});
};

// Define the request router
var router = {
    'hello' : handlers.hello
};

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res) {

    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedUrl.query;
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        var requestHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'payload' : buffer
        };

        // Route the request
        requestHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            // Log the request
            
            console.log("Response: ", statusCode, payloadString);
        });        
    });
});

// Start the HTTP server
httpServer.listen(3000, function() {
    console.log("The server is now listening on port 3000");
});
