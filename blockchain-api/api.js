const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const getBlock = require('./simpleChain').getBlock;
const addBlock = require('./simpleChain').addBlock;
const Block = require('./block')

// App setup
const app = express();

// Logging incoming requests
app.use(morgan('combined'));

// Parse incoming requests
app.use(bodyParser.json({type: '*/*'}));

// Routes
app.get('/block/:block', (req, res, next) => {
  let block = getBlock(req.params.block)
  block.then(function(result) {
    res.send(JSON.parse(result));
  })
});

app.post('/block', (req, res) => {
  console.log(req.body)
  let add = addBlock(new Block(req.body))
  add.then(function(result) {
    res.send(result);
  })
});


// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on port ", port);
