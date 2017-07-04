var http = require("http");
var cheerio = require("cheerio");
var mysql = require('mysql');
var URL = require('url');
var qs = require('querystring');

var conn_count = 0 ;
var mysql_pool ; 
var mysql_config = {
	connectionLimit : 10,
	host : "bdm271956257.my3w.com",
	user : "bdm271956257",
	password : "Lj19901107xpc",
	database : "bdm271956257_db"
}



const server = http.createServer((req,res)=>{
	var url = URL.parse(req.url);
	var param = qs.parse(url.query);

	var sql = " select * from spider_article_list limit ?,? ";
	var params = [0,20];
	execute_sql(sql,params,function(results){
		res.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
		res.write(JSON.stringify(results));
		res.end();
	});
}).listen(8888);

function execute_sql(sql,params,callback){
	if( !mysql_pool ){
		mysql_pool = mysql.createPool(mysql_config);
		mysql_pool.on("connection",function(conn){
			conn_count ++ ;
		});
		mysql_pool.on("release",function(conn){
			conn_count -- ;
		});
	}
	mysql_pool.getConnection(function(err,conn){
		if(err){
			mysql_pool.end();
			throw err;
		}
		conn.query(sql,params,function(err,results,field){
			if(err){
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

function close_poll(){
	setTimeout(function(){
		if(conn_count == 0){
			mysql_pool.end();
		}else{
			close_poll();
		}
	},2000);
}

