const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('./config.json');
const bcrypt = require('bcryptjs');

module.exports = {
	getById,
	authenticate
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user.validPassword(password)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}