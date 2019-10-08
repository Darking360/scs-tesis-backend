function transformParamsToBody(req, res, next) {
    Object.keys(req.params).forEach((key) => {
        req.body[key] = req.params[key];
    });
    next();
}

function diffMinute(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

module.exports = {
    transformParamsToBody,
    diffMinute
}