var mongoStat = require('../mongo/mongoStatistics');
var tool = require('../util/tool');
var async = require('async');

exports.insertStat = function(statisticsObj, callback){
	statisticsObj._id = tool.generateUUID();
	statisticsObj.date = new Date().getTime();
	statisticsObj.pv = 0;
	statisticsObj.uv = 0;
	statisticsObj.userLoginCount = 0;
	statisticsObj.userRegisterCount = 0;
	mongoStat.insertStat(statisticsObj, callback);
}

exports.updateStat = function(statisticsID, statisticsObj, callback){
	mongoStat.updateStat(statisticsID, statisticsObj, callback);
}

exports.removeStat = function(statisticsID, callback){
	mongoStat.removeStat(statisticsID, callback);
};

exports.getByDate = function(date, callback){//根据date去找statistics
	mongoStat.getByDate(date, callback);
};

exports.getStatistics = function(startDate, endDate, callback){//根据startDate、endDate去找statistics
	mongoStat.getStatistics(startDate, endDate, callback);
};

exports.upStat = function(statisticsData, callback){ 
	var StatDate = {};
	var date = Date.parse(tool.getThisTime().split(' ')[0]);
	async.series({
		getByDate : function(done){
			mongoStat.getByDate(date, function(err, data){
				StatDate = data;
				console.log('getByDate:',StatDate);
				done(err);
			});
		},
		insertStat : function(done){
			if(!StatDate.date){
				mongoStat.insertStat(StatDate, function(err, data){
					StatDate = data;
					console.log('insertStat:',StatDate);
					done(err);
				});
			}
		},
		updateStat : function(done){
			StatDate[statisticsData]++;
			mongoStat.updateStat(StatDate._id, StatDate, function(err, data){
				StatDate = data;
				console.log('updateStat:',StatDate);
				done(err);
			});
		}
	},function(err){
		callback(err, StatDate);
	});
}