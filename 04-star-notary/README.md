# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

This uses [ExpressJS](https://expressjs.com) which will be installed when running `npm install`. See configuration section below.

### Configuring your project

- Install requirements

```
npm install 
```

- Run server

```
npm run dev
```

### Endpoints

#### ID Validation Request 

##### Method
    POST

##### Endpoint
    http://localhost:8000/requestValidation

##### Paramaters
    address - a valid bitcoin address

#### ID Signature Validation 

##### Method
    POST

##### Endpoint
    http://localhost:8000/message-signature/validate

##### Paramaters
    address - a valid bitcoin address
    signature - a valid signed message using address and message from last step

#### Star Registration 

##### Method
    POST

##### Endpoint
    http://localhost:8000/message-signature/validate

##### Paramaters
    address - a valid bitcoin address
    star - Containing dec, ra and story (max 500 bytes)

#### Get block by height 

##### Method
    GET

##### Endpoint
    http://localhost:8000/block/:height

##### Paramaters
    height- block height

#### Get block by address 

##### Method
    GET

##### Endpoint
    http://localhost:8000/stars/address:address

##### Paramaters
    address - address used for registration

#### Get block by hash

##### Method
    GET

##### Endpoint
    http://localhost:8000/stars/hash:hash

##### Paramaters
    hash - hash of the block

#### Code of honor

Credits for resources that helped me finish the project:

- [ibrunotome](https://github.com/ibrunotome/udacity-blockchain-developer-nanodegree/tree/master/project4) from github, whose implementation of this project guided me along the way.
- Udacity project 4 concepts section
- Stack Overflow [conversion to hex](https://stackoverflow.com/questions/20580045/javascript-character-ascii-to-hex) question
