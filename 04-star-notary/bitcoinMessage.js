const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let address = '1LEnUhe1t6HQH28M92qnmPaJUFR1YaU2Ek'
let signature = 'H0btptk/kJryOvii/7VgmtKYnahXojKUefrXQ1uRlY6FO/PjxfodTDqbsesdI+G/5dkRXX1URkG41+sMNuGssJo='
let message = 'Udacity rocks!'

console.log(bitcoinMessage.verify(message, address, signature))
