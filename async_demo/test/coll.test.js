var coll = require("../async/coll.js");
var expect = require('chai').expect;

describe("async模块collection测试，说明：\r\n\r\n"+
	"  每个方法都有三个参数，async.xxxx(coll,iteratee(item,callback),handler(err,result))\r\n"+
	"  coll：一个集合，集合中的每个元素作为iteratee的item\r\n"+
	"  iteratee：处理集合中每一个元素的子函数，集合中的每个元素作为第一个入参，第二个入参是系统的一个回调方法，iteratee向其传入的参数与handler有密切关系\r\n"+
	"  callback：处理iteratee遍历后的结果，第一个参数为异常，第二个参数为回调结果，回调结果不一定是iteratee中回调方法传入的参数，callback根据主函数的不同特性，不一定会立即执行\r\n\r\n"+
	"  每个方法都友三种形式:\r\n"+
	"  xxx：iteratee并行\r\n"+
	"  xxxLimit：iteratee限制并行个数并行\r\n"+
	"  xxxSeries：iteratee串行\r\n\r\n"+
	"  Async提供了很多针对集合的函数，可以简化我们对集合进行异步操作时的步骤。如下：\r\n"+
	"  forEach：对集合中每个元素进行异步操作\r\n"+
	"  map：对集合中的每个元素通过异步操作得到另一个值，得到新的集合\r\n"+
	"  filter：对集合中元素使用异步操作进行筛选，得到符合条件的集合\r\n"+
	"  reject：与filter相似，只是判断条件时正好相反，得到剩下的元素的集合\r\n"+
	"  reduce：使用一个初始值同集合中每一个元素进行异步操作，最后得到一个唯一的结果\r\n"+
	"  detect：得到集合中满足条件的第一个数据\r\n"+
	"  sortBy：对集合中的数据进行异步操作，再根据值从小到大排序\r\n"+
	"  some/any：集合中是否有至少一个元素满足条件\r\n"+
	"  every/all：集合中是否每个元素都满足条件\r\n"+
	"  concat：对集合中的元素进行异步操作，将结果集合并成一个数组\r\n",function(){
	//parallel=>async.concat(arr,async function(arr) return obj,handler(err,obj_arr)) 
	it("concat【连接】测试：iteratee遍历完所有集合后才会调用handler,每次遍历向callback传入的参数组成一个集合作为handler的result",function(){
		console.log("concat begin...");
		return coll.test_concat([1,2,3]).then(function(data,err){
			expect(data).to.be.an("array");
		});
	});
	it("detect【监听】测试：得到集合中满足条件的第一个数据，注：handler被调用后iteratee立即停止",function(){
		//async.detect(arr,async function(arr) return bool,callback(err,arr[n once bool returns true])) 
		console.log("detect begin...");
		return coll.test_detect([1,2,3]).then(function(data,err){
			expect([1,2,3]).to.include(data);
		});
	});
	it("each【遍历】测试：iteratee遍历coll,返回异常时调用handler",function(){
		//async.each(arr,async function(item,callback),funciton(err))
		console.log("each begin...");
		return coll.test_each([1,2,3]).then(function(data,err){
			expect(data).to.be.empty;
		});
	});
	it("eachOf【索引遍历】测试：iteratee遍历coll,iteratee参数包含index[当前item在coll中的索引],返回异常时调用handler",function(){
		//async.eachOf(arr,async function(item,index,callback),funciton(err))
		console.log("eachOf begin...");
		return coll.test_eachOf([1,2,3]).then(function(data,err){
			expect(data).to.be.empty;
		});
	});
	it("every【校验】测试：与detect相反，iteratee遍历中返回false时立即调用handler，否则等待遍历完成调用，注：无论handler何时被调用，iteratee都会将coll遍历完成",function(){
		//async.every(arr,async function(item,callback),funciton(err,result[called immediatly if callback return false])
		console.log("every begin...");
		return coll.test_every([0,2,3]).then(function(data,err){
			// data value:
			// all pass =>true
			// one fail =>false immediatly
			expect(data).to.not.be.ok;
		});
	});
	it("filter【过滤】测试：过滤掉coll在iteratee中返回false的item，过滤后的coll作为handler的result",function(){
		console.log("filter begin...");
	});
	it("groupBy【分组】测试：对coll进行分组，iteratee中返回的值作为key，coll中相同key的item集合作为value，分组后的集合作为handler的result",function(){
		console.log("groupBy begin...");
	});
	it("map【映射】测试：iteratee中对coll中的item进行处理，返回一个新的数组，若抛出异常handler立即执行",function(){
		console.log("map begin...");
	});
	it("mapValues【对象值映射】测试：与map类似，coll为map，iteratee中对coll中的item.value进行处理，返回一个新的对象{item.key,newVlaue}，分组后的集合作为handler的result",function(){
		console.log("mapValues begin...");
	});
	it("reject【排斥】测试：与filter相反，排斥coll在iteratee中返回true的item，排斥后的coll作为handler的result",function(){
		console.log("reject begin...");
	});
	it("some/any【任意】测试：当集合中是否有至少一个元素满足条件时，最终callback得到的值为true",function(){
		console.log("some begin...");
	});
	it("reduce/reduceRight【换算】测试：给定一个初始值，对集合中的元素做换算，返回换算后的值，如抛出错误停止循环立即执行handler，注：reduce执行方式为串行,默认从左到右,reduceRight从右到左",function(){
		console.log("reduce begin...");
	});
	it("sortBy【排序】测试：对coll根据返回值进行排序，handler的result为排序后的集合",function(){
		console.log("sortBy begin...");
	});
	it("transform【轉化】测试：与reduce类似，给定一个初始容器，返回转换后的容器，如抛出错误停止循环立即执行handler",function(){
		console.log("transform begin...");
	});

})
 