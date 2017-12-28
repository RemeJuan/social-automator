const ypi = require('youtube-playlist-info');
const strings = require('./strings');

const { ytAPI, tweetLength } = require('../config');

const { ranDom, ranTag } = require('./general');
const { tweetNow } = require('./twitter');

function playListId() {
  const ids = [];
  return ranDom(ids);
}

const youtube = () => {
  ypi.playlistInfo(ytAPI, playListId(), playlistItems => {
    const video = ranDom(playlistItems);
    const tags = [ ...strings.newTweetTags ];

    const url = `https://www.youtube.com/watch?v=${video.resourceId.videoId}`;
    const tag = `#mtb #lususfit`;
    let tweet = `${video.title} ${url} ${tag}`;

    while (tweet.length < tweetLength && tags.length) {
      const index = ranTag(tags);
      tweet = `${tweet} ${tags[index]}`;
      tags.splice(index, 1);
    }

    return tweetNow(tweet, 'YT Tweet');
  });
};

module.exports = youtube;
