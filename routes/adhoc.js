var express = require('express');
var router = express.Router();

var keyGenerator = 1;

router.post('', function(req, res, next) {
  var adhocRequest = req.body;
  var key = 'eva-proc-' + keyGenerator++;

  //Save process
  var adhocProcess = {
    procKey: key,
    flow: adhocRequest.flow,
    data: adhocRequest.data
  }
  //processData.insert(adhocProcessa);

  //populate a process metadata
  var algKeys = [];
  for (var i = 0; i < adhocRequest.flow.processers.length; i++) {
    algKeys.push(adhocRequest.flow.processers[i].algKey);
  }
  var adhocProcessMeta = {
    procKey: key,
    status: "PENDING",
    algorithms: algKeys
  }
  console.log("Add to queue metadata: " + JSON.stringify(adhocProcessMeta))
  processMetadata.insert(adhocProcessMeta);

  res.json(adhocProcessMeta);
});

module.exports = router;
