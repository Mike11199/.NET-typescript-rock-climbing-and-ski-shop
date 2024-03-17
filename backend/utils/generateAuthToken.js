const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin) => {

  const secretKeyBuffer = Buffer.from(process.env.JWT_SECRET_KEY, 'utf8');

  return jwt.sign(
    { _id, name, lastName, email, isAdmin },
    secretKeyBuffer,
    { algorithm: 'HS256', expiresIn: "7h" }
  );
};
module.exports = generateAuthToken
