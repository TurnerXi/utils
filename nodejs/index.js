var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");
var iconv = require('iconv-lite');
var mysql = require('mysql');

var count = 0;//已查询条数
var max_id = 1498936600;
var url = "http://www.jianshu.com/recommendations/notes?category_id=56&max_id="; 
var domain_name = "http://www.jianshu.com/";

var mysql_pool = null;
var conn_threads = [];//数据库链接线程
var mysql_config = {
	connectionLimit : 10,
	host : "localhost",
	user : "root",
	password : "ilyf744520",
	database : "db_node_dev"
}

function start_request(){
	console.log("-------------------Spider Begin--------------------");
	send_request(url+max_id,fetch_article);
}

function send_request(url,callback,param_obj){
	http.get(url,function(res){
		var html = "";
		var titles = [];

		res.setEncoding("utf8");

		res.on("data",function(chunk){
			html += chunk;
		});

		res.on("end",function(){
			callback.call(null,html,param_obj);
		});

	}).on('error', function (err) {
        console.log(err);
    });
}

var list_data = [];

function fetch_article(html){
	var $ = cheerio.load(html, {decodeEntities: false});
	list_data=[];
	$("#list-container>.note-list>li").each(function(idx,el){
		//this=>li
		var list_obj = {};
		list_obj.aid = $(this).attr("id");
		var have_img = $(this).hasClass("have-img");
		list_obj.img_url = "";
		if(have_img){
			list_obj.img_url = domain_name+$(this).find(".wrap-img img").attr("src");
		}
		list_obj.author_avatar = $(this).find(".content>.author>.avatar>img").attr("src");
		list_obj.author_name = $(this).find(".content>.author>.name>a").html();
		list_obj.author_file_url = domain_name+$(this).find(".content>.author>.name>a").attr("href");
		var date_str = $(this).find(".content>.author>.name>.time").attr("data-shared-at");
		list_obj.update_time  = new Date(date_str.split("T")[0].replace("-","/") + " " + date_str.split("+")[0].split("T")[1]);  
		list_obj.title = $(this).find(".title").html();
		list_obj.content_url = domain_name+$(this).find(".title").attr("href");
		list_obj.summary = $(this).find(".abstract").html();
		list_data.push(list_obj);
	});
	max_id-=400*list_data.length;

	check_article_exists(list_data,function(){
		list_data = list_data.filter(function(obj,idx,arr){
			var flag = true;
			for(var i=0;i<arr.length;i++){
				if(arr[i].aid == obj.aid && i!=idx){
					flag = false;
				}
			}
			return flag;
		});
		list_data = list_data.sort(function(a,b){
			return a.aid>b.aid;
		});
		save_list_sync();
		console.log("=>Fetch --"+list_data.length+"-- Article ");
		for(var i=0;i<list_data.length;i++){
			console.log("=>Saving Article --"+list_data[i].aid+" : "+list_data[i].title+"-- ");
			send_request(list_data[i].content_url,fetch_content,list_data[i].aid);
		}
	});

	console.log("-------------------Spider End--------------------");	
}
//校验文章索引是否已存在
function check_article_exists(list_data,callback){
	if(list_data.length>0){
		var sql = " select count(0) as len from spider_article_list where aid = ? ";
		var params = [list_data[0].aid];
		execut_sql(sql,params,function(res){
			if(res[0]['len']<=0){
				callback.call();
			}
			if(++count<500){
				start_request();
			}else{
				close_pool();
			}
		});
	}
}

function fetch_content(html,arc_id){
	var $ = cheerio.load(html, {decodeEntities: false});
	var article = new Article();
	article.aid = arc_id;
	article.title = $(".article>.title").html();
	article.content = $(".article>.show-content").html();
	var img_url = [];
	$(".article>.show-content").find("img").each(function(idx){
		var content_img_url = domain_name+$(this).attr("src");	
		img_url.push(content_img_url);
	});
	article.img_url = img_url.join("|");
	article.save_content();
}

function save_list_sync(){
	for(var i=0;i<list_data.length;i++){
		var sql = "insert into spider_article_list (aid,title,content_url,img_url,author_avatar,author_name,author_file_url,update_time,summary) values (?,?,?,?,?,?,?,?,?) ";
		var params = [list_data[i].aid,list_data[i].title,list_data[i].content_url,list_data[i].img_url,list_data[i].author_avatar,list_data[i].author_name,list_data[i].author_file_url,list_data[i].update_time,list_data[i].summary];
		try{
			execut_sql(sql,params);
		}catch(e){
			console.error(e);
			break;
		}
		//fs.appendFileSync('article_index.txt', JSON.stringify(list_data[i])+"\r\n");	
	}
}

var Article = function(){
	this.aid = "";
	this.title = "";
	this.content = "";
	this.img_url = "";
	this.save_content = function(){
		// fs.open("./data/"+this.aid+"_"+new Date().getTime()+".txt", 'w', (err, fd) => {
		  // if (err) {
	      	// console.error(err);
		  // }else{
		  	
		  	//fs.writeFileSync("./data/"+this.aid+"_"+new Date().getTime()+".txt", this.content);	
			//save_image(domain_name+content_img_url,idx,article.aid);		

			var sql = "insert into spider_article_content (aid,title,content,img_url) values (?,?,?,?) ";
			var params = [this.aid,this.title,this.content,this.img_url];
			execut_sql(sql,params);		
		  // }
		// });
	}
}

function save_image(url,idx,aid){
	request.head(url,function(err,res,body){
		if(err){
			console.log(err);
		}
	});
	request(url).pipe(fs.createWriteStream("./image/"+aid+"_idx.png"));
}

function execut_sql(sql,params,callback){
	if(!mysql_pool){
		mysql_pool = mysql.createPool(mysql_config);
		mysql_pool.on('connection', function (connection) {
	  		conn_threads.push(connection.threadId);
		});
		mysql_pool.on('release', function (connection) {
			conn_threads.pop(connection.threadId);
		});
	}

	mysql_pool.getConnection(function(err,conn){
		if(err){
			mysql_pool.end();
			throw err;
		}
		conn.query(sql,params,function(err,results,fields){
			if(err){
				conn.release();
				return;
			}
			if(callback && typeof(callback) == "function"){
				callback.call(null,results);		
			}
			conn.release();
		})
	});
}

function close_pool(){
	setTimeout(function(){
		if(conn_threads.length == 0){
			mysql_pool.end();
		}else{
			close_pool();
		}
	},5000);
}

start_request();