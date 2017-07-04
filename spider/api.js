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
var Router = {
	10000:query_article_list,
	11000:query_article_content,
	12000:query_image_url
}

var param = "";



const server = http.createServer((req,res)=>{
	res.writeHead(200, { 'Content-Type': 'text/json' });
	var url = URL.parse(req.url);
	param = qs.parse(url.query);
	var res_data = "";

<<<<<<< HEAD:nodejs/api.js
	var sql = " select * from spider_article_list limit ?,? ";
	var params = [0,20];
	execute_sql(sql,params,function(results){
		res.writeHead(200, { 'Content-Type': 'text/json; charset=utf-8' });
		res.write(JSON.stringify(results));
=======
	if(!param["key"]){
		res_data = {flag:0,msg:"params error: param @key is not exists"};
		res.write(JSON.stringify(res_data));
		res.end();
	}else if(!Router[param["key"]]){
		res_data = {flag:0,msg:"params error: key "+param["key"]+" is not exists"};
		res.write(JSON.stringify(res_data));
		res.end();
	}

	Router[param["key"]].call(null,function(results){
		res_data = results ; 
		res.write(JSON.stringify(res_data));
>>>>>>> d96f9ded5c1cf8a75fadad4a07082fd53984d701:spider/api.js
		res.end();
	});

}).listen(8888);

server.on("close",()=>{
	close_poll();
});


function query_article_list(callback){
	var sql = " select * from spider_article_list limit ?,? ";
	var params = [0,20];

	execute_sql(sql,params,callback);
}

function query_article_content(callback){

}

function query_image_url(callback){

}


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

