const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  file: {
      type: String,
      required: [true, 'Resource file must have some path!']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Resource must belong to a user!'],
    ref: 'User'
  }
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
