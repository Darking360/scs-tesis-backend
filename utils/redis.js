var redis = require("redis");
let client;

if (process.env.REDIS_URL) {
    // Check for local usage later
    if (process.env.NODE_ENV !== 'test') {
      client = redis.createClient('redis');
    } else {
      client = redis.createClient(process.env.REDIS_URL);
    }
  } else if (process.env.NODE_ENV === 'test') {
    client = redis.createClient('redis');
  } else {
    client = redis.createClient('redis');
  }

async function readValue(key) {
    try {
        const value = await client.getAsync('foo');
        return value;
    } catch (error) {
        console.log('Error :: ', error);
    }
}

function writeValue(key, value) {
    client.set(key, value);
}

module.exports = {
    readValue,
    writeValue
}