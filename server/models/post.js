const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
name:{
    type: String,
    maxlength:100,
    required: true,
},
email:{
    type: String,
    required: true,
    trim: true,
    unique: 1
},
message:{
    type: String,
    required: true,
}
})

const Post = mongoose.model("Post", postSchema);

module.exports = {
  Post,
};