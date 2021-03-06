const Client = require('instagram-private-api').V1;
const { ranDom } = require('./general.js');
const { Feed, Like } = Client;

const { queryString, blockedTags } = require('./strings');

const liked = new Set([]);

function findandLikeTag(createSession) {
  createSession()
    .then(session => {
      const tag = ranDom(queryString).replace('#', '');
      const feed = new Feed.TaggedMedia(session, tag);

      feed.get()
      .then(res => {
        const media = ranDom(res);

        if (liked.has(media.id)) return findandLikeTag();

        liked.add(media.id);

        const mediaId = `${media.id}`;
        const n = blockedTags.some(v => media._params.caption.indexOf(v) >= 0);

        if (n) return findandLikeTag();

        return Like.create(session, mediaId)
        .then(() => console.log('Image Like Success'))
        .catch(e => console.log('Image Like Error', e));
      });
    });
}

module.exports = findandLikeTag;
