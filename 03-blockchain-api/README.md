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

This will run the server on `http://localhost:3090` and automatically generate 10 blocks.

### Endpoints

#### Get Block Endpoint

To get get block at _n_ height 
```
curl "http://localhost:3090/block/n"
```

#### Post Block Endpoint

```
curl -X "POST" "http://localhost:3090/block" \
  -H 'Content-Type: application/json' \
  -d $'{
    "body": "Testing block with test string data"
  }'
```
