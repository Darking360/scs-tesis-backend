var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
const { subscribeToTopic } = require('../models/utils');

const {
  createToken,
  validate
} = require('../models/tokens/controller');

// CRUD

router.post('/',
  validate('createToken'),
  async function(req, res, next) {
    // Create token
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const token = await createToken(req.body.token);
    if (token.err) {
      res.status(500);
      res.send(token.error);
    }
    // Token created, now subscribe to topic
    console.log(req.body)
    const subscribedToTopic = subscribeToTopic(req.body.topic, req.body.token)
    if (subscribedToTopic) {
        res.status(200);
        res.send(token);
    } else {
        res.status(500);
        res.send("Error subscribing user to Firebase notification");
    }
});

module.exports = router;