const mongoose = require("mongoose"); //mongoose is the API that connects us with the database
const Schema = mongoose.Schema; //creating a schema for the database (schema for a table)


const bookmarksSchema = new Schema(
  {
    email: {
        type: String,
        required: true,
      },
    bookmarks:{
      type: [String]
    }
  },
  { timestamps: true }
); //so we can know when the blog was last edited / created etc

const bookmarksModel = mongoose.model(
  "bookmarks",
  bookmarksSchema,
  "bookmarks"
); //now it will model the schema on the database

module.exports = bookmarksModel;