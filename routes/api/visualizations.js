const express = require("express");
const router = express.Router();

const fs = require('fs');
const path = require('path');
const csv = require("csvtojson");

router.get('/', (req, res) => {
  const seriesPath = path.join(__dirname, '../..', 'frontend/public/data/series');
  let results = [];
  let promisesArray = [];

  fs.readdir(seriesPath, (err, files) => {
    files.forEach((file, idx) => {
      promisesArray.push(
        csv()
        .fromFile(path.join(seriesPath, file))
        .then((jsonObj) => {
          results[idx] = jsonObj;
        })
      );
    });
    Promise.all(promisesArray).then(() => res.json(Object.values(results)));
  });
});

module.exports = router;