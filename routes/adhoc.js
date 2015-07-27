var express = require('express');
var shortid = require('shortid');

var router = express.Router();

router.post('', function(req, res, next) {
  var adhocRequest = req.body;
  var key = shortid.generate();

  //Save process data
  var adhocProcessData = {
    _id: key,
    data: adhocRequest.data
  }
  processDataDB.insert(adhocProcessData);

  //Save process flow
  var adhocProcessFlow = {
    _id: key,
    flow: adhocRequest.flow
  }
  processFlowDB.insert(adhocProcessFlow);

  //populate a process metadata
  var algKeys = [];
  for (var i = 0; i < adhocRequest.flow.processers.length; i++) {
    algKeys.push(adhocRequest.flow.processers[i].algKey);
  }
  var adhocProcessMeta = {
    _id: key,
    status: "PENDING",
    algorithms: algKeys
  }
  console.log("Add to queue metadata: " + JSON.stringify(adhocProcessMeta))
  processMetadataDB.insert(adhocProcessMeta);

  res.json(adhocProcessMeta);
});

module.exports = router;
