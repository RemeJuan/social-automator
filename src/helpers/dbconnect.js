const connection = ''; //FILL ME IN
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(connection);

const scheduleSchema = new Schema({
  network: { type: String, required: true, },
  media: { type: String, required: true, },
  text: { type: String, required: true, },
  posted: { type: Boolean, default: false },
  dateTime: { type: Date, required: true, },
});

const schedule = mongoose.model('remejuan', scheduleSchema);

function markPostAsPosted(entry) {
  schedule.update({ _id: entry._id }, { $set: { posted: true }})
  .then(() => console.log('updated'));
}

module.exports = {
  schedule,
  markPostAsPosted,
};
