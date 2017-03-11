const express = require('express');
const router = express.Router();

const { scheduleSchema } = require(`${global.base}/helpers/dbconnect`);

function findAllItems() {
  return scheduleSchema.find({})
  .where('posted').equals('false')
  .sort([['dateTime', 'ascending']])
  .then(res => {
    return res.reduce((acc, item) => {
      const key = item.network === 'instagram' ? 'instagram' : 'twitter';

      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  });
}

function addNewSchedule(data) {
  const update = data._id;

  if(!update) {
    return scheduleSchema.create(data)
    .then(res => res)
    .catch(err => err);
  }

  return scheduleSchema.update({ _id: data._id }, { $set: data })
  .then(res => res)
  .catch(err => err);
}

router.route('/')
  .get((req, res) => {
    findAllItems()
    .then(items => {
      res.send(items);
    });
  })
  .post((req, res) => {
    return addNewSchedule(req.body)
      .then(result => res.send(result));
  });

module.exports = router;
