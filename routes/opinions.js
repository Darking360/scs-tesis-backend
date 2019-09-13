var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
const { createUser } = require('../models/users/controller');
const { transformParamsToBody } = require('./utils');
const { getSentiment } = require('../utils/watson');

const {
  createOpinion,
  getOpinion,
  getOpinions,
  getAroundPoint,
  validate
} = require('../models/opinions/controller');

// CRUD

router.get('/',
  async function(req, res, next) {
    // Get all opinions
    const opinions = await getOpinions();
    if (opinions.err) {
      res.status(500);
      res.send(opinions.error);
    }
    res.status(200);
    res.send(opinions);
});

router.get('/search', 
  validate('searchOpinions'),
  async function(req, res, next) {
    // Create new game
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const games = await getAroundPoint([req.query.lat, req.query.lng], req.query.kilometers);
    if (games.err) {
      res.status(500);
      res.send(games.error);
    }
    res.status(200);
    res.send(games);
});

router.get('/:_id',
  transformParamsToBody,
  validate('getOpinion'),
  async function(req, res, next) {
    // Get a game
    req.body._id = req.params._id;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const game = await getOpinion(req.params._id);
    if (!game) {
      return res.status(404).json({ errors: [{ msg: 'Opinion not found' }] });
    }
    if (game.error) {
      res.status(500);
      res.send(game.error);
    }
    res.status(200);
    res.send(game);
});

router.post('/', 
  validate('createOpinion'),
  async function(req, res, next) {
    // Create new game
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const user = await createUser(ipAddress);
    // Get sentiment for opinion sent
    let sentiment = null;
    let percent = null;
    try {
      sentimentResponse = await getSentiment(req.body.opinion);
      console.log(sentimentResponse);
      const { sentiment: { document: { score, label }}} = sentimentResponse;
      sentiment = label;
      percent = Math.abs(score);
    } catch (error) {
      console.log('Error :: ', error);
    }
    const game = await createOpinion({
      user: user._id,
      sentiment,
      percent,
      ...req.body
    });
    if (game.err) {
      res.status(500);
      res.send(game.error);
    }
    res.status(200);
    res.send(game);
});

module.exports = router;