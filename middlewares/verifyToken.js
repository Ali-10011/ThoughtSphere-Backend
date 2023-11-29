const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];

      jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          authModel.findOne({ username: decoded.username }).then((result) => {
            if (result) {
              req.username = result.username;
              next();
            } else {
              return res.status(404).json({ msg: "Could not Find User" });
            }
          });
        }
      });
    }
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};
module.exports = verifyToken;
