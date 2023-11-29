const Auth = require("../models/authModel");
const profileModel = require("../models/profileModel");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    // Get user input
    const { username, password, email } = req.body;

    //Validate user input
    if (!(username && password && email)) {
      return res.status(200).send({ code: "1", msg: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Auth.findOne({ email });

    if (oldUser) {
      return res.status(200).send({ code: "0", msg: "User Already Exist. Please Login." });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10); //hashing the password

    // Create user in our database
    const newUser = await Auth.create({
      //We will not store the password in database
      email: email,
      username: username,
      password: encryptedPassword,
    });

    const newProfile = await profileModel.create(
      {
        email: email,
        blogs_count: "0",
        followers: [],
        followings: []
      }
    );

    // Create token
    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    newUser.token = token;
    // return new user
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err)
    res.status(500).json({code: "0", msg: "Internal Server ERROR" });
  }
};

const authenticateUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(200).send({code: "1", msg: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await Auth.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res.status(200).send({code: "0", msg: "This user does not exist" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      //comparing the actual password user entered with our hashed password
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );

      // user
      return res.status(200).json({code: "1", token: token, msg: "Success" });
    }
    res.status(200).send({ code: "0", msg: "Invalid Password" });
  } catch (err) {
    res.status(500).json({code: "0", msg: "Internal Server ERROR" });
  }
};

module.exports = {
  registerUser,
  authenticateUser,
};
