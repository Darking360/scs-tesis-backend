var redis = require("redis");
const client = redis.createClient();

async function readValue(key) {
    try {
        const value = client.getAsync('foo');
        return value;
    } catch (error) {
        console.log('Error :: ', error);
    }
}

function write(key, value) {
    client.set(key, value);
}