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
	it("detect测试：async.detect(arr,async function(arr) return bool,callback(err,arr[n once bool returns true])) ",function(){
		return coll.test_detect([1,2,3]).then(function(data,err){
			expect([1,2,3]).to.include(data);
		});
	});
	it("each测试：async.each(arr,async function(item,callback),funciton(err))",function(){
		return coll.test_each([1,2,3]).then(function(data,err){
			expect(data).to.be.empty;
		});
	});
	it("eachOf测试：async.eachOf(arr,async function(item,index,callback),funciton(err))",function(){
		return coll.test_eachOf([1,2,3]).then(function(data,err){
			expect(data).to.be.empty;
		});
	});
	it("every测试：async.every(arr,async function(item,callback),funciton(err,result[called immediatly if callback return false])",function(){
		return coll.test_every([0,2,3]).then(function(data,err){
			// data value:
			// all pass =>true
			// one fail =>false immediatly
			expect(data).to.not.be.ok;
		});
	});

})
 