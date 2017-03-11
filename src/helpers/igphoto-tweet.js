const Client = require('instagram-private-api').V1;
const {createSession} = require('./instagram');
const { ranDom } = require('./general.js');
const { Feed } = Client;

const { ranTag, imageTweet } = require('./general.js');

const accountId = '1549794671';

function tweetIgPhoto() {
  createSession()
  .then(session => {
    const feed = new Feed.UserMedia(session, accountId);

    return feed.get()
    .then(results => {

      const images = results.map(result => {
        const caption = result._params.caption;
        const firstTag = caption.indexOf('#');
        const title = caption.slice(0, firstTag - 1);
        const tags = caption.slice(firstTag).split(' ');

        return Object.assign({}, {
          title,
          tags,
          url: result._params.webLink,
          image: result._params.images,
        });
      });
      return ranDom(images);
    })
    .then(insta => {
      if (!insta.image) return console.log('No image to insta', insta.image);
      
      const { tags, title, url } = insta;
      const prefix = title.replace(/@/g, '');
      const tag = `#lususfit`;
      let tweet = `${prefix} ${url} ${tag}`;

      while (tweet.length < 130) {
        const index = ranTag(insta.tags);
        tweet = `${tweet} ${tags[index]}`;
        tags.splice(index, 1);
      }

      return imageTweet({status: tweet, image: insta.image[0].url}, 'Insta Tweet')
        .then(e => console.log(e))
        .catch(e => console.log(e));
    });
  });
}

module.exports = tweetIgPhoto;
