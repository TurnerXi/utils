var http = require("http");
var URL = require('url');
var qs = require('querystring');
const crypto = require('crypto');


const server = http.createServer(function(req,res){
	var param = qs.parse(URL.parse(req.url));

	if(param['key'] == 10000){
		query_space.call();
	}


}).listen(8889);


function query_space(){
	var options = {
		hostname:"iovip-z2.qbox.me",
		port : "",
		path : "/buckets",
		method : "post",
		auth : "QBox 8fxWP8s1_yaDxZQ1PPNh3E7JBiRHQryCZ4Qy9uwD",
		headers :{
			"Content-Type" : "application/x-www-form-urlencoded",
		},
		timeout : 2000
	};
	http.request(options,(res))
}


function getAccessToken(signingStr){

	var AccessKey = "8fxWP8s1_yaDxZQ1PPNh3E7JBiRHQryCZ4Qy9uwD"
	var SecretKey = "c9M6-aLVpfMoWFy87nDYa6ZXR1-rHH0OYAYjsx5H"
	var signingStr = "/buckets"
	var hmac = crypto.createHmac('DSA-SHA1', 'a secret');
	var sign = "157b18874c0a1d83c4b0802074f0fd39f8e47843"
	var encodedSign = "FXsYh0wKHYPEsIAgdPD9OfjkeEM="
	var accessToken = "MY_ACCESS_KEY:FXsYh0wKHYPEsIAgdPD9OfjkeEM="
	return accessToken;
}