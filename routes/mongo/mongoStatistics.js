var statColl = require('./mongo').getCollection('statistics');//连接数据库statistics表

exports.insertStat = function(statisticsObj, callback){//添加统计
	statColl.insert(userObj, callback);
};

exports.updateStat = function(statisticsID,statisticsObj, callback){//修改统计
	statColl.findAndModify({_id: statisticsID.toLowerCase()}, [], {$set: statisticsObj}, {new: true}, callback);
};

exports.removeStat = function(statisticsID, callback){//删除统计
	statColl.remove({_id: statisticsID}, callback);
};

exports.getByDate = function(date, callback){//根据date去找statistics
	statColl.findOne({date: date}, callback);
};
exports.getStatistics = function(startDate, endDate, callback){//根据startDate、endDate去找statistics
	statColl.find({date: {$gte: startDate, $lt: endDate}}, callback);
};