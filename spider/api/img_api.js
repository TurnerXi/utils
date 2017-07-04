const http = require("http");
const URL = require('url');
const qs = require('querystring');
const qiniu = require('qiniu');

const accessKey = "8fxWP8s1_yaDxZQ1PPNh3E7JBiRHQryCZ4Qy9uwD";
const secretKey = "c9M6-aLVpfMoWFy87nDYa6ZXR1-rHH0OYAYjsx5H";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

const bucket = "aizelasi170421";
var options = {
    "scope": bucket,
    "deadline": (new Date().getTime()/1000)+3600,
    "insertOnly": 1,
};
var policy = new qiniu.rs.PutPolicy(options);
var uptoken = policy.uploadToken(mac);

moudle.exports = ()=>{
	return {
		uploadLocalFile : (key,localFile,callback)=>{
		  	formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr,respBody, respInfo) {
			  	if (respErr) {
			    	throw respErr;
			  	}
			  	if(callback && typeof(callback)=="function"){
				  	if (respInfo.statusCode == 200) {
					    callback.call(200,respBody);
				  	} else {
					    callback.call(respInfo.statusCode,respBody);
				  	}
			  	}
			});
		},
		fetchNetImage : (key,resUrl)=>{
			bucketManager.fetch(resUrl,bucket,key,function(err,rsbody,resinfo){
				if(err){
					console.log(err);
				}else{
					if(resinfo.statusCode==200){
						console.log(rsbody);
					}else{
						console.log(rsbody);
					}
				}
			});
		}
	}
}
