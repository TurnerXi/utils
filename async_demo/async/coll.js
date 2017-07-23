var async = require("async");
var mysql = require("mysql");
var fs = require("fs");
var mysql_pool ; 
var mysql_config = {
	connectionLimit : 10,
	host : "bdm271956257.my3w.com",
	user : "bdm271956257",
	password : "Lj19901107xpc",
	database : "bdm271956257_db"
}
module.exports={
	test_concat : function(arr){
		return new Promise(function(resolve,reject){
			async.concat(arr,query_article_by_id,function(err,results){
				resolve(results);
			});
		});
	},
	test_concatLimit : function(arr,limit){
		return new Promise(function(resolve,reject){
			async.concatLimit(arr,limit,query_article_by_id,function(err,results){
				resolve(results);
			});
		});
	},
	test_concatSeries : function(arr){
		return new Promise(function(resolve,reject){
			async.concatSeries(arr,query_article_by_id,function(err,results){
				resolve(results);
			});
		});
	},
	test_detect : function(arr){
		return new Promise(function(resolve,reject){
			async.detect(arr,query_article_by_id,function(err,results){
				resolve(results);
			});
		});
	},
	test_detectLimit : function(arr,limit){
		return new Promise(function(resolve,reject){
			async.detectLimit(arr,limit,query_article_by_id,function(err,results){
				resolve(results);
			});
		});
	},
	test_detectSeries : function(arr){
		return new Promise(function(resolve,reject){
			async.detectSeries(arr,query_article_by_id,function(err,results){
				resolve(results);
			})
		});
	},
	test_each : function(arr){
		return new Promise(function(resolve,reject){
			async.each(arr,query_article_by_id,function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
				
			})
		});
	},
	test_eachLimit  : function(arr,limit){
		return new Promise(function(resolve,reject){
			async.eachLimit(arr,limit,query_article_by_id,function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
			})
		});
	},
	test_eachSeries  : function(arr){
		return new Promise(function(resolve,reject){
			async.eachSeries(arr,query_article_by_id,function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
			});
		});
	},
	test_eachOf  : function(arr){
		return new Promise(function(resolve,reject){
			async.eachOf(arr,function(item,key,callback){
				query_article_by_id(item,callback);
			},function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
			});
		});
	},
	test_eachOfLimit  : function(arr,limit){
		return new Promise(function(resolve,reject){
			async.eachOfLimit(arr,limit,function(item,key,callback){
				query_article_by_id(item,callback);
			},function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
			});
		});
	},
	test_eachOfSeries  : function(arr){
		return new Promise(function(resolve,reject){
			async.eachOfSeries(arr,function(item,key,callback){
				query_article_by_id(item,callback);
			},function(err){
				if(err){
					reject(err);	
				}else{
					resolve("");	
				}
			});
		});
	},
	test_every  : function(arr){
		return new Promise(function(resolve,reject){
			async.every(arr,query_article_by_id,function(err,result){
				if(err){
					reject(err);	
				}else{
					resolve(result);	
				}
			});
		});
	},
	test_applyEach : function(fns,arg1,arg2,callback1,callback2){
		return new Promise(function(resolve,reject){
			async.applyEach(fns,arg1,arg2,callback1,function(results){
				callback2(results);
				resolve(results);
			});
		});
	},
	test_auto : function(fnsobj,limit){
		return new Promise(function(resolve,reject){
			async.auto(fnsobj,limit,function(err,results){
				if(err){
					reject(err);
				}else{
					resolve(results);
				}
			});
		})
	},
	test_autoInject : function(fnsobj){
		return new Promise(function(resolve,reject){
			async.autoInject(fnsobj,function(err,results){
				if(err){
					reject(err);
				}else{
					resolve(results);
				}
			})
		})
	}
}


function query_article_by_id(id,callback){
	var sql = "select * from spider_article_list where id = ?";
	var result ;
	console.log("---------src: "+id+"-----------");
	execute_sql(sql,[id],function(res){
		console.log("---------dist: "+(res[0] && res[0].id)+"-----------");
		callback(null,res[0] && res[0].id);
	});
}

function execute_sql(sql,params,callback){
	if( !mysql_pool ){
		mysql_pool = mysql.createPool(mysql_config);
	}
	mysql_pool.getConnection(function(err,conn){
		if(err){
			mysql_pool.end();
			throw err;
		}
		conn.query(sql,params,function(err,results,field){
			if(err){
				console.log(err);
				conn.release();
				return;
			}
			if(callback && typeof(callback)=="function"){
				callback.call(null,results);	
			}
			conn.release();
		});
	});
}
