const Client = require('instagram-private-api').V1;
const {createSession} = require('./instagram');
const fs = require('fs');
const fetch = require('node-fetch');
const Jimp = require('jimp');
const { checkForNewPosts } = require('./general');
const { schedule, markPostAsPosted } = require('./dbconnect');

function downloadFile(uri, destPath) {
  return fetch(uri)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${uri}: ${response.statusText}`);
      }
      return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(destPath);
        response.body.on('error', (err) => {
          fileStream.close();
          reject(err);
        });
        fileStream.on('finish', resolve);
        fileStream.on('error', (err) => {
          fileStream.close();
          reject(err);
        });
        response.body.pipe(fileStream);
      });
    });
}

function uploadToInstagram(link, caption) {
  const filePath = `${global.base}/uploads/`;

  return createSession()
    .then(session => {
      const { Media, Upload } = Client;
      const fileName = 'upload.jpg';
      const jimpName = 'upload-jimp.jpg';
      const file = `${filePath}/${fileName}`;
      const jimpFile = `${filePath}/${jimpName}`;

      return downloadFile(link, file)
        .then(() => Jimp.read(file))
        .then(lenna => lenna.resize(1080, Jimp.AUTO).quality(80).write(jimpFile))
        .then(() => {
          return Upload.photo(session, jimpFile)
            .then(upload => {
              return Media.configurePhoto(session, upload.params.uploadId, caption)
                .then(() => console.log('Photo uploaded SUCCESS!!'))
                .then(() => {
                  fs.unlink(file, () => null);
                  fs.unlink(jimpFile, () => null);
                })
                .catch(e => console.log('POST ERROR', e.response.body));
            })
            .catch(e => console.log('UPLOAD ERR', e.response.body));
        })
        .catch(e => console.log('Download/Resize err', e));
    });
}

function instaImage() {
  checkForNewPosts(schedule,'instagram')
  .then(res => {
    if(res) return uploadToInstagram(res.media, res.text).then(markPostAsPosted(res));
    return console.log('No new images to insta');
  });
}

module.exports = instaImage;
