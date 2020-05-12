const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

const decode = (token) => {
  return jwt.decode(token);
};

const mobileTokenGenerator = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role || "user",
    fullName: user.fullName,
    emailAddress: user.emailAddress,
    image: user.image,
    googleID: user.googleID,
    facebookID: user.facebookID,
  };
  const secret = jwtSecret;
  return jwt.sign(payload, secret);
};

module.exports = { mobileTokenGenerator, decode };
