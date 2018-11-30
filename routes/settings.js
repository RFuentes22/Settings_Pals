var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');


/* GET settings page. */
router.get('/', function(req, res) {
  data=JSON.parse(req.session.user);
  //console.log(data);
  res.render('settings', { title: 'Express' ,data });

  
});
//Update
router.put('/', UserController.update);

module.exports = router;