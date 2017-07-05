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
module.export={
	test_concat : function(){
		console.log("begin concat...");
		async.concat([1,2,3],query_article_by_id,function(err,results){
			console.log("results....",results);
		});
		console.log("end...");
	},
	test_concatLimit : function(){
		console.log("begin concatLimit...");
		async.concatLimit([1,2,3],1,query_article_by_id,function(err,results){
			console.log("results.....",results);
		});
		console.log("end...");
	},
	test_concatSeries : function(){
		console.log("begin concatSeries...");
		async.concatSeries([1,2,3],query_article_by_id,function(err,results){
			console.log("results.....",results);
		});
	}
}

console.log("begin concatSeries...");
async.detect([0,2,3],query_article_by_id,function(err,results){
	console.log("results.....",results);
});

function query_article_by_id(id,callback){
	var sql = "select * from spider_article_list where id = ?";
	var result ;
	execute_sql(sql,[id],function(res){
		console.log(res[0] && res[0].title);
		callback(null,res[0] && res[0].title);
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
