const { TokenModel: Token } = require("./model");
const { check } = require("express-validator/check");

const validate = method => {
    switch (method) {
      case "createToken": {
        return [
          check("token", "token is required").exists(),
          check("topic", "topic is required").exists(),
        ];
      }
    }
}

// CRUD

async function createToken(token) {
    try {
      const newToken = await Token.create({ token });
      return newToken;
    } catch (error) {
      console.error("Error got from Mongo - creation :: ", error);
      return { err: true, error }
    }
  }

module.exports = {
    createToken,
    validate
};