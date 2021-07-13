const mongoose = require('mongoose');
require('dotenv').config();


const userModel = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id:{
    type: String,
    trim: true,
    unique: true,
    require: true
  },
  pw:{
    type: String,
    trim: true,
    require: true
  },
  name:{
    type: String,
    trim: true,
    require: true
  },
  phone:{
    type: String,
    trim: true,
    require: true,
    unique:true
  },
  sale:{
    type: String,
    trim:true
  },
  salt:{
    type:String,
    trim:true,
    require:true
  },
  productId:[{}],
  buyList:[{}]
});

const model = mongoose.model('users',userModel,'UserInfo');
module.exports={ model }