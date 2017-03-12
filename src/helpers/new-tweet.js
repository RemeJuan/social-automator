const { schedule, markPostAsPosted } = require('./dbconnect');
const { tweetNow, checkForNewPosts } = require('./general');
const { imageTweet } = require('./twitter');

function buildNewTweet() {
  checkForNewPosts(schedule, 'twitter')
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
