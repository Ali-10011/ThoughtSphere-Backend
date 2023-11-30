const mongoose = require("mongoose"); //mongoose is the API that connects us with the database
const Schema = mongoose.Schema; //creating a schema for the database (schema for a table)

const profileSchema = new Schema(
  {
    username: 
    {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    followings: {
      type: [String]
      
    },
    followers: {
      type: [String],
    },
    blogs_count: {
     type: String
    },
  },
  { timestamps: true }
);

const profileModel = mongoose.model("profiles", profileSchema, "profiles");

module.exports = profileModel;
