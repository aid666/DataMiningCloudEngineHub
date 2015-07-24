var express = require('express');
var router = express.Router();

router.get('', function(req, res, next) {
  processMetadata.find({ status: "PENDING" }, function (err, docs) {
    res.json(docs);
  });
});

router.get('/:wpKey', function(req, res, next) {
  var wpKey = req.params.wpKey;
  processMetadata.find({ procKey: wpKey }, function (err, docs) {
    if(docs.length > 0){
      queue_check_logs.find({ procKey: wpKey }, function (err, logs){
        res.json(logs);
      });
    }else{
      res.sendStatus(404);
    }
  });
});

router.post('/:wpKey', function(req, res, next) {
  var wpKey = req.params.wpKey;
  processMetadata.find({ procKey: wpKey }, function (err, docs) {
    if(docs.length > 0){
      queue_check_logs.insert(req.params.body);
      res.sendStatus(204);
    }else{
      res.sendStatus(404);
    }
  });
});


module.exports = router;
