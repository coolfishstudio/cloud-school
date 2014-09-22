var express = require('express');
var router = express.Router();
var pageUser = require('./pageUser');

/* GET home page. */
router.get('/', pageUser.checkLogin);
router.get('/', function(req, res){
	var mobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers['user-agent']);
	if(mobileBrowser){
		res.render('main/index', { title: 'Express' });
	}else{
		res.render('manage/index', { user: req.session.user});
	}
});

//session √
router.get('/login', pageUser.checkNotLogin);
router.get('/login', pageUser.getLogin);
router.post('/login', pageUser.login);
router.get('/signup', pageUser.checkNotLogin);
router.get('/signup', pageUser.getReg);
router.post('/signup', pageUser.registeredUser);
router.get('/logout', pageUser.checkLogin);
router.get('/logout', pageUser.logout);
//user
router.get('/user', pageUser.getUser);
//lession
router.get('/lession', function(req, res){
	res.render('manage/lession',{ user: req.session.user});
});


module.exports = router;
