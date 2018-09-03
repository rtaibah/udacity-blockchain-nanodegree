const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain')
const Block = require('./block')

// App setup
const app = express();

// Logging incoming requests
app.use(morgan('combined'));

// Parse incoming requests
app.use(bodyParser.json({type: '*/*'}));

// Routes
app.get('/block/:block', (req, res, next) => {
  let block = Blockchain.getBlock(req.params.block)
  block.then(function(result) {
    res.send(JSON.parse(result));
  })
});

app.post('/block', (req, res) => {
  console.log(req.body)
  let add = Blockchain.addBlock(new Block(req.body))
  add.then(function(result) {
    res.send(result);
  })
});


// Server setup
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on port ", port);
