const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
      body: {
        type: String,
      },
      post: {
        type: Schema.Types.ObjectId,
        ref: "post"
      },
    },
  {timestamps: true}
  )

  module.exports = mongoose.model('comment', commentSchema);