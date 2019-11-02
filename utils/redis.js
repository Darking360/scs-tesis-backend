var redis = require("redis");
let client;

if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL);
} else if (process.env.NODE_ENV === 'test') {
  client = redis.createClient({ host: 'redis' });
} else {
  client = redis.createClient({ host: 'redis' });
}

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

async function readValue(key) {
    try {
        const value = await getAsync(key);
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