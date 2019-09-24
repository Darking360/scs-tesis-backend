const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema({
  token: { type: String, required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = {
    TokenModel,
    TokenSchema
};