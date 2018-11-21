const db = require('level')('./data/star');

class StarValidation {
  constructor(req) {
    this.req = req;
  }

  validateAddressParameter() {
    if (!this.req.body.address) {
      throw new Error('No address provided. Please provide one.');
    }
    return true;
  }

  saveNewRequestValidation(address) {
    const timestamp = Date.now();
    const message = `${address}:${timestamp}:starRegistry`;
    const validationWindow = 300;

    const data = {
      address: address,
      message: message,
      requestTimeStamp: timestamp,
      validationWindow: validationWindow,
    };

    db.put(data.address, JSON.stringify(data));
    return data;
  }

  async getPendingAddressRequest(address) {
    return new Promise((resolve, reject) => {
      db.get(address, (err, value) => {
        if (value === undefined) {
          return reject(new Error('Address not found'));
        } else if (err) {
          return reject(err);
        }

        value = JSON.parse(value);

        const underFiveMinutes = Date.now() - 5 * 60 * 1000;
        const isExpired = value.requestTimeStamp < underFiveMinutes;

        if (isExpired) {
          resolve(this.saveNewRequestValidation(address));
        } else {
          const data = {
            address: address,
            message: value.message,
            requestTimeStamp: value.requestTimeStamp,
            validationWindow: Math.floor(
              (value.requestTimeStamp - underFiveMinutes) / 1000,
            ),
          };
          resolve(data);
        }
      });
    });
  }
}

module.exports = StarValidation;
