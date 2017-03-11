const twit = require('twit');
const config = require('../config');
const base64Img = require('base64-img');

const Twitter = new twit(config);

function tweetNow(tweetTxt, type) {
  return new Promise((resolve, reject) => {
    const tweet = {
      status: tweetTxt
    };
    const n = config.blacklist.some(v => tweetTxt.indexOf(v) >= 0);

    if (n) {
      return reject(`${type} Skipped!!`);
    }
    else {
      Twitter.post('statuses/update', tweet, err => {
        if (err) {
          return reject(`${type} ERROR!: ${err}`);
        }
        else {
          return resolve(`${type} SUCCESS!`);
        }
      });
    }
  });
}

function imageTweet(tweetData, type) {
  return new Promise((resolve, reject) => {
    const tweet = {
      status: tweetData.status,
    };

    base64Img.requestBase64(tweetData.image, (err, res, body) => {
      const media = body.slice(23);
      Twitter.post('media/upload', { media_data: media }, (err, data) => {
        if (err) return reject(`${type} ERROR!: ${err}`);

        const mediaIdStr = data.media_id_string;
        const altText = tweet.status;
        const meta_params = {
          media_id: mediaIdStr,
          alt_text: {
            text: altText,
          },
        };

        Twitter.post('media/metadata/create', meta_params, err => {
          if (err) return reject(err);
          const params = { status: altText, media_ids: [mediaIdStr] };

          Twitter.post('statuses/update', params, (err) => {
            if (err) return reject(`${type} ERROR!!`);

            return resolve(`${type} SUCCESS!!`);
          });
        });
      });
    });
  });
}

module.exports = {
  tweetNow,
  imageTweet,
};
