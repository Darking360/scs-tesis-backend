const mongoose = require('mongoose');
const admin = require("firebase-admin");

const serviceAccount = require("../smart-san-cristobal-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-san-cristobal.firebaseio.com"
});

function sendNotification(topic) {
    const message = {
        notification: {
            title: "Account Deposit",
            body: "A deposit to your savings account has just cleared."
          },
        data: {
            account: "Savings",
            balance: "$3020.25"
        },
        topic: topic
    };
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}

async function subscribeToTopic(topic, token) {
    try {
        const response = await admin.messaging().subscribeToTopic([token], topic);
        return response
    } catch (error) {
        console.log("Error :: ", error);
        return null;
    }
}

function validateMongooseType(value) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('ID is not valid');
    }
    return true
}

function validateLocationType(location) {
    if (typeof location !== 'object') {
        throw new Error('Location should be an Object');
    }
    if (location.type !== 'Point') {
        throw new Error('Opinion location should be a point');
    }
    console.log(location.coordinates.length)
    if (typeof location.coordinates !== 'object' && location.coordinates.length !== 2) {
        throw new Error('Opinion location should be an array of points of size 2: latitude and longitude');
    }
    return true
}

function validateNumber(potentialNumber) {
    if (isNaN(potentialNumber)) {
        throw new Error('Should be a number');
    }
    return true
}

module.exports = {
    validateMongooseType,
    validateLocationType,
    validateNumber,
    sendNotification,
    subscribeToTopic
}