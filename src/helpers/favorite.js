const twit = require('twit');
const ura = require('unique-random-array');

const config = require('../config');
const { queryString, blockedTags, resultType } = require('./strings');

const qs = ura(queryString);
const rt = ura(resultType);

const Twitter = new twit(config);

const { ranDom } = require('./general.js');
const blocked = new Set([...config.blacklist]);

const favoriteTweet = () => {
  let paramQS = qs();
  const paramRT = rt();
  const params = {
    q: paramQS,
    result_type: paramRT,
    lang: 'en'
  };

  Twitter.get('search/tweets', params, (err, data) => {
    const tweet = data.statuses;
    const randomTweet = ranDom(tweet);
    const selectedTweet = typeof randomTweet === 'undefined';

    if(selectedTweet) {
      return favoriteTweet();
    } else {
      const screenName = `@${randomTweet.user.screen_name}`;
      const blacklist = blocked.has(screenName);
      const n = blockedTags.some(v => randomTweet.text.indexOf(v) >= 0);

      if (blacklist || n) return favoriteTweet();

      Twitter.post('favorites/create', {
        id: randomTweet.id_str
      }, err => {
        if (err) {
          console.log(`CANNOT BE FAVORITE... Error:, ${err}, Query String: ${paramQS}`);
        }
        else {
          console.log(`FAVORITED... Success!!!, Query String: ${paramQS}`);
        }
      });
    }
  });
};

module.exports = favoriteTweet;
