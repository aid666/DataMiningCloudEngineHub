var express = require('express');
var router = express.Router();

router.get('', function(req, res, next) {
  processMetadataDB.find({ status: "PENDING" }, function (err, docs) {
    res.json(docs);
  });
});

module.exports = router;
