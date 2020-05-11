require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");
const tokenGenerator = require("./tokenGenerator");
const socialMediaTokenGenerator = require("./socialMediaTokenGenerator");

const userObject = (user) => ({
  id: user.id,
  fullName: user.fullName,
  emailAddress: user.emailAddress,
  image: user.image,
  googleID: user.googleID,
  facebookID: user.facebookID,
});

const API_FAILURE = process.env.FAIL_URL || "http://localhost:3000/failure";
const API_SUCCESS = process.env.SUCCESS_URL || "http://localhost:3000/success";

// MARK: -- local
router.post("/signup", (request, response) => {
  const user = request.body;
  const hash = bcrypt.hashSync(request.body.password, 10);
  user.password = hash;
  User.add(user)
    .then(([res]) => {
      const token = tokenGenerator(res);
      response.status(201).json({
        message: "successfully registered user",
        user: userObject(user),
        token,
      });
    })
    .catch(({ name, message, stack }) => {
    if(message.includes("duplicate key")){
        response.status(400).json({ error: "User already exists", name, message, stack })
    } else if (message.includes("violates not-null")) {
        response.status(400).json({ error: "missing a necessary field", name, message, stack })
    } else {
        response.status(500).json({ error: "error registering user", name, message, stack })
    };
    });
});

router.post("/signin", (request, response) => {
  const { emailAddress, password } = request.body;
  User.findBy({ emailAddress })
    .then((res) => {
      if (res && bcrypt.compareSync(password, res.password)) {
        bcrypt.compareSync(password, res.password);
        token = tokenGenerator(res);
        response.status(200).json({
          message: "successfully logged in",
          token,
          user: userObject(res),
        });
        } else {
        response.status(400).json({ message: "invalid credentials" });
      };
    })
    .catch(({ name, message, stack }) => {
        response.status(500).json({ error: "error logging in user", name, message, stack })
    });
});

// MARK: -- google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: API_FAILURE }),
  socialMediaTokenGenerator
);

// MARK: -- facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: API_FAILURE }),
  socialMediaTokenGenerator
);

module.exports = router;
