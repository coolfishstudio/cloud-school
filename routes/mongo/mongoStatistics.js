var statColl = require('./mongo').getCollection('statistics');//连接数据库statistics表
var tool = require('../util/tool');

exports.insertStat = function(statisticsObj, callback){//添加统计
	statisticsObj['_id'] = tool.generateUUID();
	var date = Date.parse(tool.getThisTime().split(' ')[0].replace(/\-/g,'\/'));
	statisticsObj['date'] = date;
	statisticsObj['pv'] = 0;
	statisticsObj['uv'] = 0;
	statisticsObj['userLoginCount'] = 0;
	statisticsObj['userRegisterCount'] = 0;
	statColl.insert(statisticsObj, callback);
};

exports.updateStat = function(statisticsID,statisticsObj, callback){//修改统计
	statColl.findAndModify({_id: statisticsID}, [], {$set: statisticsObj}, {new: true}, callback);
};

exports.removeStat = function(statisticsID, callback){//删除统计
	statColl.remove({_id: statisticsID}, callback);
};

exports.getByDate = function(date, callback){//根据date去找statistics
	statColl.findOne({date: date}, callback);
};
exports.getStatistics = function(startDate, endDate, callback){//根据startDate、endDate去找statistics
	statColl.find({date: {$gt: startDate, $lte: endDate}}).toArray(callback);
};
