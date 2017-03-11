const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Johannesburg');

// Frequency in minutes
const retweetFrequency = 5;
const favoriteFrequency = 9;
const igLikeFrequency = 2;
const newTweetFrequency = 480 + Math.floor(Math.random() * 11);
const tweetIgPhotoFrequency = 180 + Math.floor(Math.random() * 13);
const youtubeTweetFrequency = 360 + Math.floor(Math.random() * 15);
const instaCheckFrequency = 60;
const intervalsCheckFrequency = 30;

// RANDOM QUERY STRING  =========================
const retweet = require('./helpers/retweet');
const favoriteTweet = require('./helpers/favorite');
const buildNewTweet = require('./helpers/new-tweet');
const youtubeTweet = require('./helpers/youtube-tweet');
const tweetIgPhoto = require('./helpers/igphoto-tweet');
const instaImage = require('./helpers/upload-insta');
const likeOrCommentInsta = require('./helpers/instagram');

const startTime = moment({h: 8, m: 0});
const endTime = moment({h: 17, m: 0});

let instagramLikeInterval;

likeOrCommentInsta();
tweetIgPhoto();
youtubeTweet();
buildNewTweet();
retweet();
favoriteTweet();

setInterval(instaImage, 60000 * instaCheckFrequency);
setInterval(tweetIgPhoto, 60000 * tweetIgPhotoFrequency);
setInterval(youtubeTweet, 60000 * youtubeTweetFrequency);
setInterval(buildNewTweet, 60000 * newTweetFrequency);
setInterval(retweet, 60000 * retweetFrequency);
setInterval(favoriteTweet, 60000 * favoriteFrequency);

function checkIntervals() {
  if(moment().isAfter(startTime) && moment().isBefore(endTime) && startTime.weekday() < 6) {
    console.log(('IG like start'));
    instagramLikeInterval = setInterval(likeOrCommentInsta, 60000 * igLikeFrequency);
  } else {
    console.log(('IG like end'));
    clearInterval(instagramLikeInterval);
  }
}
checkIntervals();
setInterval(checkIntervals, 60000 * intervalsCheckFrequency);
