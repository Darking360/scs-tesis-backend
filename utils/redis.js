var redis = require("redis");
const client = redis.createClient();

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