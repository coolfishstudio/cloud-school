var mongoStat = require('../mongo/mongoStatistics'),
	mongoStatCount = require('../mongo/mongoStatisticsCount');
var tool = require('../util/tool');
var async = require('async');

exports.insertStat = function(statisticsObj, callback){
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

exports.getStat = function(startDate, endDate, callback){//根据startDate、endDate去找statistics
	mongoStat.getStatistics(startDate, endDate, callback);
};
exports.getStatCount = function(callback){
	mongoStatCount.getCount(callback);
};


exports.setStat = function(statisticsData, callback){ 
	var StatDate = {};
	var StatCountDate = {};
	var date = Date.parse(tool.getThisTime().split(' ')[0].replace(/\-/g,'\/'));
	async.series({
		getByDate : function(done){
			mongoStat.getByDate(date, function(err, data){
				StatDate = data;
				done(err);
			});
		},
		insertStat : function(done){
			if(!StatDate){
				mongoStat.insertStat({}, function(err, data){
					StatDate = data[0];
					done(err);
				});
			}else{
				done();
			}
		},
		updateStat : function(done){
			StatDate[statisticsData]++;
			mongoStat.updateStat(StatDate._id, StatDate, function(err, data){
				StatDate = data;
				done(err);
			});
		},
		getCount : function(done){
			mongoStatCount.getCount(function(err, data){
				StatCountDate = data;
				done(err);
			});
		},
		insertCount : function(done){
			if(!StatCountDate){
				mongoStatCount.insertStatCount({}, function(err, data){
					StatCountDate = data[0];
					done(err);
				});
			}else{
				done();
			}
		},
		updateCount : function(done){
			if(!StatCountDate[statisticsData]){
				StatCountDate[statisticsData] = 1;
			}else{
				StatCountDate[statisticsData]++;
			}
			mongoStatCount.updateStatCount(StatCountDate, function(err, data){
				StatCountDate = data;
				done(err);
			});
		},
	},function(err){
		callback(err, StatDate);
	});
}