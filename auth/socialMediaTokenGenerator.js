const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

module.exports = function tokenGenerator(req, res) {
  console.log("req: ", req.user);
  const user = req.user;
  const payload = {
    subject: user.id,
    username: user.username || "",
    role: user.role || "user",
    fullName: user.fullName || "",
    emailAddress: user.emailAddress || "",
    image: user.image || "",
    googleID: user.googleID || "",
    facebookID: user.facebookID || "",
  };
  const secret = jwtSecret;
  const options = {
    expiresIn: "24h",
  };
  res.redirect(
    process.env.SM_REDIRECT + "?token=" + jwt.sign(payload, secret, options)
  );
};
