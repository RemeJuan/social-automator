const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Johannesburg');

function ranDom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function ranTag(tags) {
  const index = Math.floor(Math.random() * tags.length);
  return index;
}

function checkForNewPosts(db, network) {
  return db.findOne({
    dateTime: { $lte: moment() },
    network,
    posted: false,
  })
  .then(res => res);
}

module.exports = {
  checkForNewPosts,
  ranDom,
  ranTag,
};
