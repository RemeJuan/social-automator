const twit = require('twit');
const config = require('../config');
const Twitter = new twit(config);

const { queryString, blockedTags, resultType } = require('./strings');

const ura = require('unique-random-array');
const qs = ura(queryString);
const rt = ura(resultType);

const blocked = new Set([...config.blacklist]);

const retweet = () => {
  let paramQS = qs();
  const paramRT = rt();
  const params = {
    q: paramQS,
    result_type: paramRT,
    lang: 'en'
  };

  Twitter.get('search/tweets', params, (err, data) => {
    let retweetId = null;
    let screenName = null;
    let blacklist = null;
    let retweetText = null;

    if (!err) {
      try {
        retweetId = data.statuses[0].id_str;
        screenName = `@${data.statuses[0].user.screen_name}`;
        retweetText = data.statuses[0].text;
        blacklist = blocked.has(screenName);

        const n = blockedTags.some(v => retweetText.indexOf(v) >= 0);

        if (blacklist || n) throw { message: 'User/Tag in blacklist' };
      }
      catch (e) {
        console.log(`retweetId DERP!, ${e.message}, Query: ${paramQS}, User: ${screenName}`);
        return retweet();
      }

      Twitter.post('statuses/retweet/:id', {
        id: retweetId
      }, (err, response) => {
        if (response) {
          console.log(`RETWEETED!, Query String: ${paramQS}`);
        }
        if (err) {
          console.log(`RETWEET ERROR! Duplication maybe...:, ${err}, Query String: ${paramQS}`);
        }
      });
    }
    else {
      console.log('Something went wrong while SEARCHING...');
    }
  });
};

module.exports = retweet;
