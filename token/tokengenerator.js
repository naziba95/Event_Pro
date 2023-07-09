const crypto = require('crypto');

const tokenSecret = crypto.randomBytes(32).toString('hex');
console.log(tokenSecret);
