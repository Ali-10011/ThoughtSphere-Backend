const express = require("express");
const {
  registerUser,
  authenticateUser,
} = require("../controllers/authsController");

const router = express.Router();

//Register a User
router.post("/register", registerUser);

//Authenticate a User
router.post("/login", authenticateUser);

//Exporting Modules
module.exports = router;
