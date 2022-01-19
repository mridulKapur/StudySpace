const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post must have a title"],
  },
  body: {
    type: String,
    required: [true, "A post must have a body"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'post must belong to a user!'],
    ref: 'User'
  },
  resourceId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource'
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = User;
