var user = require('./module/user'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config'),
    statistics = require('./module/statistics');

//跳转到注册页面
exports.getReg = function(req, res){
    res.render('manage/signup');
};
//跳转到登录页面
exports.getLogin = function(req, res){
    res.render('manage/login');
};
//跳转到用户管理页面
exports.getUser = function(req, res){
    var endDate = Date.parse(tool.getThisTime().split(' ')[0].replace(/\-/g,'\/'));//today
    var startDate = endDate - 60*60*24*14*1000;
    var statList = [];
    var statCount = {};
    var page = req.body.page || 1;
    var userList = [];    
    async.series({
        //获取统计
        getStat14 : function(done){
            statistics.getStat(startDate, endDate, function(err, info){
                statList = info;
                done(err);
            });
        },
        //获取注册总数
        getRegisterStatCount : function(done){
            statistics.getStatCount(function(err, info){
                statCount = info;
                done(err);
            });
        },
        //获取用户列表
        getAllByPage: function(done){
            user.findAllByPage(config.USERPAGENUM, page, function(err, info){
                userList = info;
                done(err);
            });
        },

    },function(err){
        res.render('manage/user', { user: req.session.user, statList : statList, statCount : statCount, userList : userList});
    });
};
//注册用户
exports.registeredUser = function(req,res){
    var userEmail = req.body.email;
    var passWord = req.body.passWord;
    async.series({
    	//查看是否有这个用户
        findUserEmail: function(done){
        	user.getByUserEmail(userEmail, function(err, info){
        		if(!err){
                    if(null != info){
                        done('该用户名称已经存在了。');
                    }else{
                        done();
                    }
                }else{
                    done(err);
                }
        	});
        },
        //注册用户
        regUser: function(done){
            user.insertUser({
                name : userEmail,
                avatar : 'images/avatars/default.jpg',
                email : userEmail,
                role : 'consumer',
                passWord : tool.getMD5(passWord)
            },function(err, info){
                if(!err){
                    req.session.user = info[0];
                    done();
                }else{
                    done(err);
                }
            });
        },
        //添加注册纪录
        setRegisterStat : function(done){
            statistics.setStat('userRegisterCount', function(err, info){
                done(err);
            });
        },
        //添加登录纪录
        setLoginStat : function(done){
            statistics.setStat('userLoginCount', function(err, info){
                done(err);
            });
        }
    }, function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '注册成功。'});
        }      
    })
};
//用户登录
exports.login = function(req, res){
    var userEmail = req.body.email;
    var passWord = req.body.passWord;
    var userInfo = {};
    async.series({
        //根据email去查询
        findByUserEmail: function(done){
            user.getByUserEmail(userEmail, function(err, info){
                if(!err){
                    if(null != info){
                        userInfo = info;
                        done();
                    }else{
                        done('该帐户不存在，请检查你的输入信息。');
                    }
                }else{
                    done(err);
                }
            });
        },
        //判断找到的数据是否密码一样
        contrastPassword: function(done){
            if(tool.getMD5(passWord) == userInfo.passWord){
                req.session.user = userInfo;//用户信息存入 session
                done();
            }else{
                done('密码不正确，请重新输入。');
            }
        },
        //添加登录纪录
        setLoginStat : function(done){
            statistics.setStat('userLoginCount', function(err, info){
                done(err);
            });
        }
    },function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '登录成功。'});
        } 
    });
};
//退出
exports.logout = function(req, res){
    req.session.user = null;
    res.redirect('/login');
}
// //获取用户列表信息 分页
// exports.findAllByPage = function(req, res, next){

// }
//页面权限控制
exports.checkLogin = function(req, res, next){
  if(!req.session.user){
    // res.send({status: -1, content: '未登录!'});
    res.redirect('/login');
  }
  next();
}
exports.checkNotLogin = function(req, res, next){
  if(req.session && req.session.user){
    // res.send({status: -1, content: '已登录!'});
    res.redirect('back');//返回之前的页面
  }
  next();
}
