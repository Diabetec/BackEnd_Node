const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Ufood = require('./userfood')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : { type: String},
    sex : {type: String},
    age : { type: Number },
    height : { type: Number },
    weight : { type: Number }, 
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    foods : [{ type: Ufood.schema }]
});

// hash the password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);