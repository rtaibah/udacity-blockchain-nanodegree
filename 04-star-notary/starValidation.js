const db = require('level')('./data/star');
const bitcoinMessage = require('bitcoinjs-message');

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

  validateSignatureParameter() {
    if (!this.req.body.signature) {
      throw new Error('No signature provided. Please provide one');
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

  async validateSignature(address, signature) {
    return new Promise((resolve, reject) => {
      db.get(address, (err, value) => {
        if (value === undefined) {
          return reject(new Error('Not Found'));
        } else if (err) {
          return reject(err);
        }
        value = JSON.parse(value);
        // Check if messageSignature is valid
        if (value.messageSignature === 'valid') {
          return resolve({
            registerStar: true,
            status: value,
          });
          // Check if registeration window has not expired
        } else {
          const underFiveMinutes = Date.now() - 5 * 60 * 1000;
          const isExpired = value.requestTimeStamp < underFiveMinutes;
          let isValid = false;

          if (isExpired) {
            value.validationWindow = 0;
            value.messageSignature = 'Validation window expired';
          } else {
            // Check if message signature is valid
            value.validationWindow = Math.floor(
              (value.requestTimeStamp - underFiveMinutes) / 1000,
            );
            try {
              isValid = bitcoinMessage.verify(
                value.message,
                address,
                signature,
              );
            } catch (err) {
              isValid = false;
            }
            value.messageSignature = isValid ? 'valid' : 'invalid';
          }
          db.put(address, JSON.stringify(value));

          return resolve({
            registerStar: !isExpired && isValid,
            status: value,
          });
        }
      });
    });
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
