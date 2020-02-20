const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { jwtsecret } = require("../config/secrets.js");
const Users = require("../models/users.js");

// MARK: -- endpoints beginning with /api/auth
router.post("/signup", (req, res) => {
  let user = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        res.status(500).json({ message: "error with hash" });
      } else {
        user.password = hash;
        Users.add(user)
          .then(saved => {
            const token = signToken(saved);
            res.status(201).json({ 
              token: token, 
              id: saved.id, 
              email: saved.email 
            });
          })
          .catch(err => {
            res.status(400).json({ message: "Error in saving user to DB" });
          });
      }
    });
  });
});

router.post("/login", (req, res) => {
  let { email, password } = req.body;
  console.log("login email", email);

  Users.findBy({ email })
    .first()
    .then(user => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then(match => {
            if (match) {
              const token = signToken(user);
              res.status(200).json({
                token: token,
                id: user.id,
                email: user.email
              });
            } else {
              // Error in match
              res.status(401).json({ message: "Invalid Credentials" });
            }
          })
          .catch(err => {
            // Error in compare
            res.status(500).json({ message: "Invalid Credentials" });
          });
      } else {
        res.status(400).json({ message: "No user found in DB" });
      }
    })
    .catch(err => {
      console.log("error in find");
      res.status(500).json({ message: "Invalid Credentials" });
    });
});

function signToken(user) {
  const payload = {
    id: user.id
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtsecret, options);
}

module.exports = router;
