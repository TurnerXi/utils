var coll = require("../async/coll.js");
var expect = require('chai').expect;

describe("async模块collection测试",function(){
	it("concat测试：parallel=>async.concat(arr,async function(arr) return obj,callback(err,obj_arr)) ",function(){
		return coll.test_concat([1,2,3]).then(function(data,err){
			expect(data).to.be.an("array");
		});
	});
	it("concatLimit测试：parallel=>async.concatLimit(arr,limit[parallel num once],async function(arr) return obj,callback(err,obj_arr)) ",function(){
		return coll.test_concatLimit([1,2,3],2).then(function(data,err){
			expect(data).to.be.an("array");
		});
	});
	it("concatSeries测试：series=>async.concatSeries(arr,async function(arr) return obj,callback(err,obj_arr)) ",function(){
		return coll.test_concatSeries([1,2,3]).then(function(data,err){
			expect(data).to.be.an("array");
		});
	});
	it("detect测试：parallel=>async.detect(arr,async function(arr) return bool,callback(err,arr[n once bool returns true])) ",function(){
		return coll.test_detect([1,2,3]).then(function(data,err){
			expect([1,2,3]).to.include(data);
		});
	});
	it("detectLimit测试：parallel=>async.detectLimit(arr,limit[parallel num once],async function(err) return bool,callback(err,arr[n once bool returns true]))",function(){
		return coll.test_detectLimit([1,2,3],2).then(function(data,err){
			expect([1,2]).to.include(data);
		});
	});
	it("detectSeries测试：series=>async.detectSeries(arr,async function(arr) return bool,callback(err,arr[n once bool returns true]))",function(){
		return coll.test_detectSeries([0,2,3]).then(function(data,err){
			expect(2).to.equal(data);
		});
	})
})
 