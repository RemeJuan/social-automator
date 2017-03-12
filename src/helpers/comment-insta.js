const Client = require('instagram-private-api').V1;
const { ranDom } = require('./general.js');
const config = require('../config');
const { Feed, Comment } = Client;

const { queryString, blockedTags, comments } = require('./strings');

const blocked = new Set([...config.blacklist]);

function findAndCommentTag(createSession) {
  createSession()
    .then(session => {
      const tag = ranDom(queryString).replace('#', '');
      const feed = new Feed.TaggedMedia(session, tag);

      feed.get()
      .then(res => {
        const media = ranDom(res);
        const comment = ranDom(comments);
        const screenName = `@${media.account._params.username}`;
        const mediaId = `${media.id}`;
        const n = blockedTags.some(v => media._params.caption.indexOf(v) >= 0);
        const blacklist = blocked.has(screenName);

        if(blacklist || n) return findAndCommentTag();

        return Comment.create(session, mediaId, comment)
        .then(() => console.log('Image Comment Success', media.params.webLink))
        .catch(e => console.log('Image Comment Error', e));
      });
    });
}

module.exports = findAndCommentTag;
