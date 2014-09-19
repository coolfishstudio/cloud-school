var userColl = require('./mongo').getCollection('user');//连接数据库user表

exports.insertUser = function(userObj, callback){//添加用户
	userColl.insert(userObj, callback);
};

exports.updateUser = function(userID,userObj, callback){//修改用户
	userColl.findAndModify({_id: userID}, [], {$set: userObj}, {new: true}, callback);
};

exports.removeUser = function(userID, callback){//删除用户
	userColl.remove({_id: userID}, callback);
};

exports.getByUserEmail = function(userEmail, callback){//根据username去找user
	userColl.findOne({email: userEmail}, callback);
};
