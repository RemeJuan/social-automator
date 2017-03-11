const { remejuan, markPostAsPosted } = require('./dbconnect');
const moment = require('moment-timezone');

const { tweetNow } = require('./general');
const { imageTweet } = require('./twitter');

moment.tz.setDefault('Africa/Johannesburg');

function checkForNewPosts() {
  return remejuan.findOne({
    dateTime: { $lte: moment() },
    network: 'twitter',
    posted: false,
  })
  .then(res => res);
}

function buildNewTweet() {
  checkForNewPosts()
  .then(res => {
    if (!res.media) {
      return tweetNow(res.text, res.network)
        .then(markPostAsPosted(res))
        .catch(e => console.log(e));
    }
    return imageTweet({ status: res.text, image: res.media})
      .then(markPostAsPosted(res))
      .catch(e => console.log(e));
  });
}

module.exports = buildNewTweet;
