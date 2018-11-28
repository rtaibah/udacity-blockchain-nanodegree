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

  validateNewStarRequest() {
    // Some variable deconstructions
    const { star } = this.req.body;
    const { dec, ra, story } = star;

    // check if there is an address
    if (!this.validateAddressParameter() || !star) {
      throw new Error(
        'No address or parameters. Please make sure you enter these values!',
      );
    }

    // Check if star information is valid
    if (
      typeof dec !== 'string' ||
      dec.length === 0 ||
      typeof ra !== 'string' ||
      ra.length === 0 ||
      typeof story !== 'string' ||
      story.length === 0 ||
      story.length > 500
    ) {
      throw new Error('Your star information is invalid');
    }

    // Check if story is ascii
    const isASCII = ((str) => {
        return /^[\x00-\x7F]*$/.test(str);
    })

    if (!isASCII(story)) {throw new Error('Your story is not ASCII, please fix that')}
  }

  isValid() {
    // return value from db
    return db.get(this.req.body.address).then(value => {
      value = JSON.parse(value);
      if (value.messageSignature === 'valid') {
        return 'valid';
      } else {
        return 'invalid';
      }
    });
  }

  invalidate(address) {
    // delete address from db
    db.del(address)
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
        // Check if messageSignature object exists or is valid
        if (value.messageSignature === 'valid') {
          return resolve({
            registerStar: true,
            status: value,
          });
          // If messageSignature is false or does not exist, move on. Check if  registeration window has not expired
        } else {
          const underFiveMinutes = Date.now() - 5 * 60 * 1000;
          const isExpired = value.requestTimeStamp < underFiveMinutes;
          let isValid = false;

          if (isExpired) {
            value.validationWindow = 0;
            value.messageSignature = 'Validation window expired';
          } else {
            // If registration window has not expired, check if message signature is valid
            // set new validation window
            value.validationWindow = Math.floor(
              (value.requestTimeStamp - underFiveMinutes) / 1000,
            );
            try {
              // Check message signature
              isValid = bitcoinMessage.verify(
                value.message,
                address,
                signature,
              );
            } catch (err) {
              isValid = false;
            }
            // Set isValid
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
