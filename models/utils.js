const mongoose = require('mongoose');

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
    validateNumber
}