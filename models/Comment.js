import mongoose, { Schema } from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
