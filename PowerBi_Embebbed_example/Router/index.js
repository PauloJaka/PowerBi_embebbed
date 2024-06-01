const express = require('express'),
   router = express.Router(),
   mainCtrl = require('../Controller/index');
  router.get('/report/:groupId/:reportId', mainCtrl.embedReport);
  module.exports = router;