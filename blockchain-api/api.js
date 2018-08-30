const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain.js')

// App setup
const app = express();

// Logging incoming requests
app.use(morgan('combined'));

// Parse incoming requests
app.use(bodyParser.json({type: '*/*'}));

// Routes
app.get('/', (req, res, next) => {
  res.send(Blockchain.Blockchain.getBlock(0));
});


// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on port ", port);
