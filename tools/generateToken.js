const jwt = require('jsonwebtoken');
const token = jwt.sign({userId:'user-3', role:'dean'}, process.env.JWT_SECRET || 'secret', {expiresIn:'24h'});
console.log(token);
