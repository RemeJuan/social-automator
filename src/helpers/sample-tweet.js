const fetch = require('node-fetch');
const strings = require('./strings');

const { ranDom, tweetNow, ranTag } = require('./general.js');
const { tweetLength } = require("../config");

function newGeneratedTweet() {
  const tags = [ ...strings.newTweetTags ];

  fetch('API URL HERE')
  .then(res =>res.json())
  .then(res => ranDom(res))
  .then(res => {
    const prefix = ranDom(strings.newTweetPrefix);
    const url = `URL TO ITEM`;
    const tag = `#PERSONAL_TAG_HERE`;
    let tweet = `${prefix} ${res.name} ${url} ${tag}`;

    while (tweet.length < tweetLength && tags.length) {
      const index = ranTag(tags);
      tweet = `${tweet} ${tags[index]}`;
      tags.splice(index, 1);
    }

    return tweetNow(tweet, 'SOME Tweet')
      .then(e => console.log(e))
      .catch(e => console.log(e));
  })
  .catch(err => console.log(err));
}

module.exports = newGeneratedTweet;
