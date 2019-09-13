const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose;

const UserSchema = new Schema({
  ipAddress: { type: String, required: true, index: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  opinions: [{ type: Schema.Types.ObjectId, ref: 'Opinion' }]
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel,
    UserSchema
};