const config = require('../config');
const findandLikeTag = require('./like-insta');
const findAndCommentTag = require('./comment-insta');

const { user, pass } = config.igauth;

const Client = require('instagram-private-api').V1;
const device = new Client.Device(user);
const storage = new Client.CookieFileStorage(`${global.base}/cookies/${user}.json`);
let session;

function createSession() {
  if(!session) {
    return Client.Session.create(device, storage, user, pass)
      .then(ses => {
        session = ses;
        return session;
      });
  }

  return Promise.resolve(session);
}

function likeOrCommentInsta() {
  const rand = (Math.random() * 10);
  const method = rand <= 5 ? findandLikeTag : findAndCommentTag;

  return method(createSession);
}

module.exports = {
  createSession,
  likeOrCommentInsta
};
