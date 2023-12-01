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
          return res.status(401).json({ code: "0", msg: err.message });
        } else {
          authModel.findOne({ email: decoded.email }).then((result) => {
            if (result) {
              req.email = result.email;
              next();
            } else {
              return res.status(404).json({code:"0", msg: "Could not Find User" });
            }
          });
        }
      });
    }
  } catch (error) {
    return res.status(404).json({code:"0", msg: error });
  }
};
module.exports = verifyToken;
