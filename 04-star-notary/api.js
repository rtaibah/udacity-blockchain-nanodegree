const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const Block = require('./block');
const StarValidation = require('./starValidation');

// App setup
const app = express();

// Logging incoming requests
app.use(morgan('combined'));

// Parse incoming requests
app.use(bodyParser.json({ type: '*/*' }));

validateAddressParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req);
    starValidation.validateAddressParameter();
    next();
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

validateSignatureParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req);
    starValidation.validateSignatureParameter();
    next();
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

validateNewStarRequest = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req);
    starValidation.validateNewStarRequest();
    next();
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

// Routes

app.post('/block', [validateNewStarRequest], async (req, res) => {
  const starValidation = new StarValidation(req);
  const isValid = await starValidation.isValid()
  starValidation.validateNewStarRequest()
  //check if request is valid
  try {
    if (!isValid){
      throw new Error('There was an error')
    }
    

  } catch(error){
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  return
  }

  let add = Blockchain.addBlock(new Block(req.body));
  add.then(function(result) {
  res.send(result);
  });
});

app.get('/block/:block', async (req, res, next) => {
  let block = await Blockchain.getBlock(req.params.block);
  res.json(block);
});

app.get('/stars/address:address', async (req, res) => {
})

app.get('/stars/hash:hash', async (req, res) => {
})

app.post('/requestValidation', [validateAddressParameter], async (req, res) => {
  const starValidation = new StarValidation(req);
  const address = req.body.address;

  try {
    data = await starValidation.getPendingAddressRequest(address);
  } catch (error) {
    data = await starValidation.saveNewRequestValidation(address);
  }

  res.json(data);
});

app.post(
  '/message-signature/validate',
  [validateAddressParameter, validateSignatureParameter],
  async (req, res) => {
    const starValidation = new StarValidation(req);
    const address = req.body.address;
    const signature = req.body.signature;
    try {
      const response = await starValidation.validateSignature(
        address,
        signature,
      );
      if (response.registerStar) {
        res.json(response);
      } else {
        res.status(401).json(response);
      }
    } catch (error) {
      res.status(404).json({
        status: 404,
        message: error.message,
      });
    }
  },
);

// Server setup
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port ', port);

