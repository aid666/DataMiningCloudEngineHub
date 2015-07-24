var express = require('express');
var router = express.Router();


var processStatuses = {
  1:
    {
        key: 1,
        name: "processStatuse 1"
    },
  2:
    {
        key: 2,
        name: "processStatuse 2"
    }

}

router.post('', function(req, res, next) {
  console.log("generate new process");
  res.json(
    {
      "procKey":1
    });
});

/* GET flow processStatuses. */
router.get('/:key', function(req, res, next) {
  res.json(processStatuses[req.params.key]);
});

/* POST process result. */
router.get('/:key/result', function(req, res, next) {
  res.json({
    name: 'Mock Data'
  });
});


router.get('/:pKey/checklogs', function(req, res, next) {
  var pKey = req.params.pKey;
  processMetadata.count({ procKey: pKey }, function (err, count) {
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
  processMetadata.count({ procKey: pKey }, function (err, count) {
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
            processMetadata.update({procKey: pKey, status: 'PENDING'}, { $set: {status: 'RUNNING'}}, {}, function(err, numReplaced){
              if(err == null && numReplaced == 1){
                //Update
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
