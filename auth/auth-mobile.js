const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");
const { mobileTokenGenerator } = require("./mobileTokenGenerator");
// const decode = require("./mobileTokenGenerator");

const userObject = (user) => ({
  id: user.id,
  fullName: user.fullName,
  emailAddress: user.emailAddress,
  image: user.image,
  googleID: user.googleID,
  facebookID: user.facebookID,
});

// MARK: iOS Signup
router.post("/signup", (request, response) => {
  const user = request.body;
  const hash = bcrypt.hashSync(request.body.password, 10);
  user.password = hash;
  User.add(user)
    .then(([res]) => {
      const token = mobileTokenGenerator(res);
      response.status(201).json({
        message: "successfully registered user",
        user: userObject(user),
        token,
      });
    })
    .catch(({ name, message, stack }) => {
      if (message.includes("duplicate key")) {
        response
          .status(400)
          .json({ error: "User already exists", name, message, stack });
      } else if (message.includes("violates not-null")) {
        response
          .status(400)
          .json({ error: "missing a necessary field", name, message, stack });
      } else {
        response
          .status(500)
          .json({ error: "error registering user", name, message, stack });
      }
    });
});

// MARK: iOS Signin
router.post("/signin", (request, response) => {
  const { emailAddress, password } = request.body;
  User.findBy({ emailAddress })
    .then((res) => {
      if (res && bcrypt.compareSync(password, res.password)) {
        bcrypt.compareSync(password, res.password);
        token = mobileTokenGenerator(res);
        response.status(200).json({
          message: "successfully logged in",
          token,
          user: userObject(res),
        });
      } else {
        response.status(400).json({ message: "invalid credentials" });
      }
    })
    .catch(({ name, message, stack }) => {
      response
        .status(500)
        .json({ error: "error logging in user", name, message, stack });
    });
});

module.exports = router;
