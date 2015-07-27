var express = require('express');
var router = express.Router();

router.get('/:pKey/data', function(req, res, next) {
  var pKey = req.params.pKey;
  processDataDB.find({ _id: pKey }, function (err, docs) {
    if(docs.length > 0){
      res.json(docs.shift())
    }else{
      res.sendStatus(404);
    }
  });
});

router.get('/:pKey/flow', function(req, res, next) {
  var pKey = req.params.pKey;
  processFlowDB.find({ _id: pKey }, function (err, docs) {
      if(docs.length > 0){
        res.json(docs.shift())
      }else{
        res.sendStatus(404);
      }
  });
});

router.get('/:pKey', function(req, res, next) {
  var pKey = req.params.pKey;
  processMetadataDB.find({ _id: pKey }, function (err, docs) {
      if(docs.length > 0){
        res.json(docs.shift())
      }else{
        res.sendStatus(404);
      }
  });
});

router.get('/:pKey/checklogs', function(req, res, next) {
  var pKey = req.params.pKey;
  processMetadataDB.count({ _id: pKey }, function (err, count) {
    if( count > 0 ){
      queue_check_logs.find({ procKey: pKey }, function (err, logs){
        res.json(logs);
      });
    }else{
      res.sendStatus(404);
    }
  });
});

router.post('/:pKey/checklogs', function(req, res, next) {
  var pKey = req.params.pKey;
  processMetadataDB.count({ _id: pKey }, function (err, count) {
    if( count > 0 ){
      var resLog = req.body;
      var checkResult = resLog == null ? null : resLog.status;

      function insertLog(){
        var newLog = {
          procKey: pKey,
          recordDatetime: new Date(),
          checkDatetime: resLog.datetime,
          status: checkResult,
          description: resLog.description,
          checkerKey: resLog.checkerKey
        }
        queue_check_logs.insert(newLog);
        res.sendStatus(204);
      }
      if( checkResult == null ){
          res.status(403).send('CheckResult can not be empty.');
      }else if( checkResult == 'ACCEPT' ){
        //Check the logs, only one ACCEPT can be insert into logs.
        queue_check_logs.count({procKey: pKey, status: 'ACCEPT'}, function (err, count){
          if( count == 0 ){
            processMetadataDB.update(
              { _id: pKey, status: 'PENDING' },
              { $set: {status: 'RUNNING'} },
              {},
              function(err, numReplaced){
                if(err == null && numReplaced == 1){
                  insertLog();
              }
            })
          }else{
            res.status(403).send('Already ACCEPT by the dispatcher');
          }
        });
      }else{
        insertLog();
      }
    }else{
      res.sendStatus(404);
    }
  });
});

module.exports = router;
