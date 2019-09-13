var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
const { transformParamsToBody } = require('./utils');

const {
  createUser,
  getUsers,
  getUserByUsername,
  validate
} = require('../models/users/controller');

// CRUD

router.get('/by_username/:username',
  transformParamsToBody,
  validate('getByUsername'),
  async function(req, res, next) {
    // Get user by username
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const users = await getUserByUsername(req.params.username);
    if (users.err) {
      res.status(500);
      res.send(users.error);
    }
    res.status(200);
    res.send(users);
});

router.get('/',
  async function(req, res, next) {
    // Get all users
    const users = await getUsers();
    if (users.err) {
      res.status(500);
      res.send(users.error);
    }
    res.status(200);
    res.send(users);
});

router.post('/',
  async function(req, res, next) {
    // Create new user
    const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const user = await createUser(ipAddress);
    if (user.err) {
      res.status(500);
      res.send(user.error);
    }
    res.status(200);
    res.send(user);
});

/*
router.patch('/', 
  // validate('createUser'),
  function(req, res, next) {
    // Get all users
    const users = getUsers();
    if (users.err) {
      res.status(500);
      res.send('Internal error querying');
    }
    res.status(200);
    res.send(users);
});

router.delete('/', 
  // validate('createUser'),
  function(req, res, next) {
    // Get all users
    const users = getUsers();
    if (users.err) {
      res.status(500);
      res.send('Internal error querying');
    }
    res.status(200);
    res.send(users);
});
*/

module.exports = router;
