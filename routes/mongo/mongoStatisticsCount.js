var statCountColl = require('./mongo').getCollection('statisticsCount');//连接数据库statisticsCount表
var config = require('../../config');

exports.insertStatCount = function(statisticsCountObj, callback){//添加统计
	statisticsCountObj._id = config.STATCOUNTID;
	statCountColl.insert(statisticsCountObj, callback);
};

exports.updateStatCount = function(statisticsCountObj, callback){//修改统计
	statCountColl.findAndModify({_id: config.STATCOUNTID}, [], {$set: statisticsCountObj}, {new: true}, callback);
};

exports.getCount = function(callback){
	statCountColl.findOne({_id: config.STATCOUNTID}, callback);
};
