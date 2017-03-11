/** TWITTER APP CONFIGURATION
 * consumer_key
 * consumer_secret
 * access_token
 * access_token_secret
 */

// Uncomment for when deploying to Heroku

// module.exports = {
//   consumer_key: process.env.CONSUMER_KEY,
//   consumer_secret: process.env.CONSUMER_SECRET,
//   access_token: process.env.ACCESS_TOKEN,
//   access_token_secret: process.env.ACCESS_TOKEN_SECRET,
// };

module.exports = {
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: '',
  blacklist: ['@YOURSELF_HERE'],
  igauth: {
    user: '',
    pass: '',
  },
};
