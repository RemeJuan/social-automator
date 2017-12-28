# social-automator
A small node application to use to automate repetitive interactions on certain social networks.

A relatively simple to use not application that will simply run in the background on a server and perform you basic tasks either on a time or a schedule.

A small express server is in place to allow easier use with free services like [Heroku](https://www.heroku.com) or [OpenShift](http://openshift.redhat.com/) who suspend smaller tier applications.

## Currently supported services
 * Twitter
 * Instagram

## Features
 * Twitter
  * Like/Favorite Tweet
  * Retweet Tweet
  * Create new Text Tweet
  * Create new Media Tweet
  * Basic logic around blacklist filters
  * Tweet YouTube videos

 * Instagram
  * Like post
  * Comment on post
  * Create post
  * Basic logic around blacklist filters
  * In memory tracking of posts that have already been like/commented on to prevent multiple comments.

### Details
Basic premise works around the `strings.js` file, a JS object like:
```
queryString: [], // Tags to search for
blockedTags: [], // Tags to exclude
resultType: [], // Used for twitter searches
comments: [], // Comments to post on twitter
```

You define a series of tags within the Query string array and these will be used for searches within twitter and instragram to determine which to like/favorite or comment on.

These can be run through simple `setInterval` or included as part of the scheduler.

The blacklist simply checks the result of the search for any posts that also include one of the tags as an exclusion, many times users will use tags like `#nature` or `#sport` as part of porn posts, which usually contain additional tags like `#porn` or `#sex` which can then easily be excluded from actions.

You can also link it up to your blog, if it has an API or RSS feed, which you can use to post/repost articles to twitter on a timeout, maybe get some more exposure by tweeting your posts 3 or 4 times a day.

### Instructions

#### Setup

* You can either run `npm install` or `yarn`
* Define your Twitter keys and Instagram auth in `src/config.js`
* Define tags within `strings.js`
* OPTIONAL: setup mongodb config `src/dbconnect.js`.
* `npm run serve` to start application in dev mode and `npm start` for production.

#### Twitter
Make sure to set you application keys in the `src/config.js` in order to be able to use any methods attached to twitter

 * `favorite.js` favorite a post based on search results from the tag search on twitter.
 * `twitter.js` a helper file with the methods for creating new text or media posts.
 * `igphoto-tweet.js` fetches your latest post and creates a native image post on twitter with a random instagram post.
 * `new-tweet.js` creates a new tweet based on an API response from mongo. Can easily be modified to use an RSS or alternate API, see `sample-tweet.js`.
 * `retweet.js` retweets a tweet from search results against matching tags.
 * `youtube-tweet.js` connect this to your's or anyones youtube playlist to create tweets for that.

#### Instagram
You will need to set your actual username and password into the `src/instagram.js` file, this is how the instagram portion works. A session control helper will limit the need for constant logins.

 * `comment-insta.js` This will write a comment on a random post based on tag search results using the comments array in strings.
 * `instagram.js` general setup file which will control your sessions. Also contains a helper to toggle between like and comment to prevent being picked up as a bot. I highly recommend using this with caution and limiting it to a timeframe.
 * `like-insta.js` likes a random image from instagram based on search results.
 * `upload-insta.js` handles the uploading of an image to instagram the way it wants it, also deals with checking mongo for new posts to post to instagram.

#### Schedule posts
 * `bdconnect.js` Configuration for working a mongo db, a conenction URL is required.

The setup is in place to use a mongodb along with a user interface https://github.com/RemeJuan/social-automator-ui, this UI can be connected to the API within this application to read and write tot he mongodb, allowing you to set specific schedules for specific posts to either network.

### Credits
This would not of been possible without some of the great work by the developers behind all these modules, most notably:

 * [instagram-private-api](https://github.com/huttarichard/instagram-private-api)
 * [twit](https://github.com/ttezel/twit)
 * [youtube-playlist-info](https://github.com/benkaiser/youtube-playlist-info)
 * [twitter-bot-bootstrap](https://github.com/spences10/twitter-bot-bootstrap)
