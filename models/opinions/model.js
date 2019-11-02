const mongoose = require("mongoose");
const { Schema } = mongoose;

const sentimentDictionary = {
  negative: "negativo",
  neutral: "neutral",
  positivo: "positivo"
};

const OpinionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  opinion: { type: String, required: true },
  service: { type: String, enum: ["agua", "luz", "transporte", "internet"], required: true},
  sentiment: { type: String, enum: ["negative", "positive", "negative", null]},
  percent: { type: Number },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  }
}, { timestamps: true });

OpinionSchema.index({ location: '2dsphere' });

const OpinionModel = mongoose.model("Opinion", OpinionSchema);

module.exports = {
  OpinionModel,
  OpinionSchema
};
