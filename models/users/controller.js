const { UserModel: User } = require("./model");
const { check } = require("express-validator/check");
const { validateMongooseType } = require('../utils');

// Validations

const validate = method => {
  switch (method) {
    case "getUser": {
      return [
        check("_id", "_id is required").exists(),
        body('_id').custom(validateMongooseType)
      ];
    }
    case "getByUsername": {
      return [
        check("ipAddress", "ipAddress is required").exists(),
      ];
    }
    case "deleteUser": {
      return [
        check("_id", "_id is required").exists(),
        body('_id').custom(validateMongooseType)
      ];
    }
    case "updateUser": {
      return [
        check("_id", "_id is required").exists(),
        body('_id').custom(validateMongooseType)
      ];
    }
  }
};

// CRUD

async function createUser(ipAddress) {
  try {
    // If user already exists, retrieve and return that one
    const [oldUser] = await getUsers({ ipAddress });
    if (oldUser) { return oldUser };
    const newUser = await User.create({ ipAddress });
    return newUser;
  } catch (error) {
    console.error("Error got from Mongo - creation :: ", error);
    return { err: true, error }
  }
}

async function getUser(_id) {
  try {
    const user = await User.findOne({ _id });
    return user;
  } catch (error) {
    console.error("Error got from Mongo - get single :: ", error);
    return { err: true, error }
  }
}

async function getUserByUsername(ipAddress) {
  try {
    const user = await User.findOne({ ipAddress });
    return user;
  } catch (error) {
    console.error("Error got from Mongo - get single :: ", error);
    return { err: true, error }
  }
}

async function getUsers(params = {}) {
  try {
    const users = await User.find({ ...params }).populate('games');
    return users;
  } catch (error) {
    console.error("Error got from Mongo - get multiple :: ", error);
    return { err: true, error }
  }
}

async function deleteUser(_id, optional = {}) {
  try {
    await User.deleteMany({ ...optional });
    return true;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return { err: true, error }
  }
}

async function updateUser(_id, updateData = {}) {
  try {
    const user = await User.findOne({ _id });
    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });
    await user.save();
    return user;
  } catch (error) {
    console.error("Error got from Mongo - update :: ", error);
    return { err: true, error }
  }
}

async function addGameToUser(_id, gameId) {
  try {
    const user = await User.findOne({ _id });
    user.games.push(gameId);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return { err: true, error }
  }
}



module.exports = {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserByUsername,
  addGameToUser,
  validate
};
