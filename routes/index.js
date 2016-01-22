var express = require('express');
var helper =  require('../helper/helper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var something = {params:{}};
    something.params.uid = "999999990057";
    something.params.time_stamp = 1453487285;
    something.params.name = "Rohit Pandey";
  helper.sendAuthReq(something);
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    console.log(req.params.uid);
    helper.sendAuthReq(req);
    res.render('index', { title: 'Express' });
});

module.exports = router;
