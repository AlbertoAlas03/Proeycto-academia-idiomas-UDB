const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
    const options = {
        expiresIn: '1h',
    }

    const token = jwt.sign(payload, secretKey, options);
    return token;    
}

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
}

module.exports = {
    generateToken,
    verifyToken
}