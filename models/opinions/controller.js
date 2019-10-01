const { OpinionModel: Opinion } = require("./model");
const { check, body } = require("express-validator/check");
const { addOpinionToUser } = require("../opinions/controller");
const { validateMongooseType, validateLocationType, validateNumber } = require("../utils");
const { sendNotification } = require("../utils");
const { topicAll } = require('../constants');
const { readValue, writeValue } = require('../../utils/redis');

// Validations

const validate = method => {
  switch (method) {
    case "createOpinion": {
      return [
        check("opinion", "Opinion must be passed").exists(),
        check("opinion", "Opinion must be a String").isString(),
        check("service", "Service must be passed").exists(),
        check("service", "Service must be a String").isString(),
        check("opinion", "Opinion must be between 10 and 140 characters").isLength({ min: 10, max: 140 }),
        check("location", "Location must be passed").exists(),
        body("location").custom(validateLocationType)
      ];
    }
    case "getOpinion": {
      return [
        check("_id", "_id is required").exists(),
        body("_id").custom(validateMongooseType)
      ];
    }
    case "deleteOpinion": {
      return [
        check("_id", "_id is required").exists(),
        body("_id").custom(validateMongooseType)
      ];
    }
    case "updateOpinion": {
      return [
        check("_id", "_id is required").exists(),
        body("_id").custom(validateMongooseType)
      ];
    }
    case "searchOpinions": {
      return [
        check("lat", "lat is required").exists(),
        check("lng", "lng is required").exists(),
        check("kilometers", "kilometers is required").exists(),
        check("lat", "lat must be a number").custom(validateNumber),
        check("lng", "lng must be a number").custom(validateNumber),
        check("kilometers", "kilometers must be a number").custom(validateNumber),
      ];
    }
  }
};

// Helper to send notification

async function checkOpinionThreshold({ location, service }) {
  const OpinionsCountOfDay = Options.find({
    created_at: new Date()
  }).count();
  const badOpinionsCount = Opinion.find({
    sentiment,
    "location": {
      $near: {
        $maxDistance: kilometers * 1000, // Adjust this to correct kilometer differ
        $geometry: {
          type: "Point",
          coordinates: [location.latitude, location.longitude]
        }
      }
    },
    created_at: new Date()
  }).count();
  const lastNotificationSent = await readValue(`opinions:${service}:date`);
  if (badOpinionsCount > (OpinionsCountOfDay - badOpinionsCount)) {
    sendNotification(topicAll, newOpinion._id);
    writeValue(`opinions:${service}:date`, new Date());
  }
}

// CRUD methods

async function createOpinion(opinion) {
  try {
    const newOpinion = await Opinion.create({ ...opinion });
    checkOpinionThreshold(newOpinion);
    return newOpinion;
  } catch (error) {
    console.error("Error got from Mongo - creation :: ", error);
    return { err: true, error };
  }
}

async function getOpinion(_id) {
  try {
    const game = await Opinion.findOne({ _id });
    return game;
  } catch (error) {
    console.error("Error got from Mongo - get single :: ", error);
    return { err: true, error };
  }
}

async function getOpinions(params = {}) {
  try {
    const opinions = await Opinion.find({ ...params });
    return opinions;
  } catch (error) {
    console.error("Error got from Mongo - get multiple :: ", error);
    return { err: true, error };
  }
}

async function deleteOpinion(_id) {
  try {
    await Opinion.deleteMany({ _id });
    return true;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return { err: true, error };
  }
}

async function updateOpinion(_id, updateData = {}) {
  try {
    const game = await Opinion.findOne({ _id });
    Object.keys(updateData).forEach(key => {
      game[key] = updateData[key];
    });
    await game.save();
    return game;
  } catch (error) {
    console.error("Error got from Mongo - update GAME :: ", error);
    return { err: true, error };
  }
}

// Helper methods
async function getAroundPoint(point, kilometers) {
  try {
    const opinions = await Opinion.find({
      "location": {
        $near: {
          $maxDistance: kilometers * 1000,
          $geometry: {
            type: "Point",
            coordinates: point
          }
        }
      }
    });
    return opinions;
  } catch (error) {
    console.error("Error got from Mongo - get multiple :: ", error);
    return { err: true, error };
  }
}

module.exports = {
  createOpinion,
  getOpinion,
  getOpinions,
  updateOpinion,
  deleteOpinion,
  getAroundPoint,
  validate
};
