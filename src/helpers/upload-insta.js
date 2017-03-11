const Client = require('instagram-private-api').V1;
const {createSession} = require('./instagram');
const fs = require('fs');
const request = require('request');
const Jimp = require('jimp');
const { remejuan, markPostAsPosted } = require('./dbconnect');

const moment = require('moment-timezone');

moment.tz.setDefault('Africa/Johannesburg');

function checkForNewPosts() {
  return remejuan.findOne({
    dateTime: { $lte: moment() },
    network: 'instagram',
    posted: false,
  })
  .then(res => res);
}

function uploadToInstagram(link, caption) {
  const filePath = `${global.base}/remejuan/uploads/`;

  const download = function(uri, filename, callback) {
    request.head(uri, () => {
      request(uri).pipe(fs.createWriteStream(`${filePath}/${filename}`))
        .on('close', callback);
    });
  };

  return createSession()
    .then(session => {
      const { Media, Upload } = Client;
      const fileName = 'upload.jpg';
      const jimpName = 'upload-jimp.jpg';
      const file = `${filePath}/${fileName}`;
      const jimpFile = `${filePath}/${jimpName}`;

      return download(link, fileName, () => {
        return Jimp.read(file)
          .then(lenna => lenna.resize(1080, Jimp.AUTO).quality(80).write(jimpFile))
          .then(() => {
            return Upload.photo(session, jimpFile)
              .then(upload => {
                return Media.configurePhoto(session, upload.params.uploadId, caption)
                  .then(() => console.log('Photo uploaded SUCCESS!!'))
                  .then(() => {
                    fs.unlink(file, () => null);
                    fs.unlink(jimpFile, () => null);
                    return;
                  })
                  .catch(e => console.log('POST ERROR', e.response.body));
              })
              .catch(e => console.log('UPLOAD ERR', e.response.body));
          })
          .catch(e => console.log('Resize err', e));
      });
    });
}

function instaImage() {
  checkForNewPosts()
  .then(res => {
    if(res) return uploadToInstagram(res.media, res.text).then(markPostAsPosted(res));
    return console.log('No new images to insta');
  });
}

module.exports = instaImage;
