var coll = require("../async/coll.js");
var expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

describe("Async模块Collection测试\r\n"+
		 "说明：\r\n"+
	     "每个方法都有三个参数，async.xxxx(coll,iteratee(item,callback),handler(err,result))\r\n"+
		 "  coll：一个集合，集合中的每个元素作为iteratee的item\r\n"+
		 "  iteratee：处理集合中每一个元素的子函数，集合中的每个元素作为第一个入参，第二个入参是系统的一个回调方法，iteratee向其传入的参数与handler有密切关系\r\n"+
		 "  callback：处理iteratee遍历后的结果，第一个参数为异常，第二个参数为回调结果，回调结果不一定是iteratee中回调方法传入的参数，callback根据主函数的不同特性，不一定会立即执行\r\n\r\n"+
		 "  每个方法都有三种形式:\r\n"+
		 "  xxx：iteratee并行\r\n"+
		 "  xxxLimit：iteratee限制并行个数并行\r\n"+
		 "  xxxSeries：iteratee串行\r\n",function(){
	
		it("concat【连接】测试：iteratee遍历完所有集合后才会调用handler,每次遍历向callback传入的参数组成一个集合作为handler的result",function(){
			addContext(this, "concat：对集合中的元素进行异步操作，将结果集合并成一个数组");
			addContext(this, "var test_concat = "+coll.test_concat);
			return coll.test_concat([1,2,3]).then(function(data,err){
				expect(data).to.be.an("array");
			});
		});
		it("detect【监听】测试：得到集合中满足条件的第一个数据，注：handler被调用后iteratee立即停止",function(){
			addContext(this, "detect：得到集合中满足条件的第一个数据");
			return coll.test_detect([1,2,3]).then(function(data,err){
				expect([1,2,3]).to.include(data);
			});
		});
		it("each【遍历】测试：iteratee遍历coll,返回异常时调用handler",function(){
			addContext(this, "each：对集合中每个元素进行异步操作");
			return coll.test_each([1,2,3]).then(function(data,err){
				expect(data).to.be.empty;
			});
		});
		it("eachOf【索引遍历】测试：iteratee遍历coll,iteratee参数包含index[当前item在coll中的索引],返回异常时调用handler",function(){
			addContext(this, "eachOf：对集合中每个元素进行异步操作, 可以每个元素在集合中的索引");
			return coll.test_eachOf([1,2,3]).then(function(data,err){
				expect(data).to.be.empty;
			});
		});
		it("every【校验】测试：与detect相反，iteratee遍历中返回false时立即调用handler，否则等待遍历完成调用，注：无论handler何时被调用，iteratee都会将coll遍历完成",function(){
			addContext(this, "every/all：集合中是否每个元素都满足条件");
			return coll.test_every([0,2,3]).then(function(data,err){
				expect(data).to.not.be.ok;
			});
		});
		it("filter【过滤】测试：过滤掉coll在iteratee中返回false的item，过滤后的coll作为handler的result",function(){
			addContext(this, "filter：对集合中元素使用异步操作进行筛选，得到符合条件的集合");
		});
		it("groupBy【分组】测试：对coll进行分组，iteratee中返回的值作为key，coll中相同key的item集合作为value，分组后的集合作为handler的result",function(){
			addContext(this, "groupBy：对集合中元素使用异步操作进行分组，得到分组后的集合");
		});
		it("map【集合映射】测试：iteratee中对coll中的item进行处理，返回一个新的数组，若抛出异常handler立即执行",function(){
			addContext(this, "map：对集合中的每个元素通过异步操作得到另一个值，组成新的数组");
		});
		it("mapValues【map值映射】测试：与map类似，coll为map，iteratee中对coll中的item.value进行处理，返回一个新的对象{item.key,newVlaue}，分组后的集合作为handler的result",function(){
			addContext(this, "mapValues：对map中的每个键值对通过异步操作得到另一组相同键不同值的键值对，组成新的map");
		});
		it("reject【排斥】测试：与filter相反，排斥coll在iteratee中返回true的item，排斥后的coll作为handler的result",function(){
			addContext(this, "reject：与filter相似，只是判断条件时正好相反，得到剩下的元素的集合");
		});
		it("some/any【任意】测试：当集合中是否有至少一个元素满足条件时，最终callback得到的值为true",function(){
			addContext(this, "some/any：集合中是否有至少一个元素满足条件");
		});
		it("reduce/reduceRight【换算】测试：给定一个初始值，对集合中的元素做换算，返回换算后的值，如抛出错误停止循环立即执行handler，注：reduce执行方式为串行,默认从左到右,reduceRight从右到左",function(){
			addContext(this, "reduce：使用一个初始值同集合中每一个元素进行异步操作，最后得到一个唯一的结果");
		});
		it("sortBy【排序】测试：对coll根据返回值进行排序，handler的result为排序后的集合",function(){
			addContext(this, "sortBy：对集合中的数据进行异步操作，再根据值从小到大排序");
		});
		it("transform【轉化】测试：与reduce类似，给定一个初始容器，返回转换后的容器，如抛出错误停止循环立即执行handler",function(){
			addContext(this, "transform：与reduce相似，使用一个初始容器集合中每一个元素进行异步操作，最后得到转换后的容器");
		});

})

describe("async模块Control Flow测试",function(){
	
	it("applyEach【遍历应用】测试：并行遍历，统一回调",function(){
		addContext(this, "主函数中的所有参数都依次作为每个子函数的参数,最后一个参数如果是回调方法则会当所有子函数执行完后才执行");
		var laugh = function(arg1,arg2,callback1,callback2){
			callback1(arg1+arg2+"laughing....");
			callback2("all finished....");
		}
		var cry = function(arg1,arg2,callback1,callback2){
			callback1(arg1+arg2+"cry.....");
			callback2("all finished....");
		}	
		return coll.test_applyEach([laugh,cry],"snooby","test",function(result){
			console.log("callback1:"+result);
		},function(results){
			console.log("callback2:"+results);
		}).then(function(data,err){
			expect(data).to.be.eq("all finished....");
		});
	});

	it("auto【自动任务】测试：自动切换流程控制，返回结果映射",function(){
		addContext(this, "1.无依赖方法参数为（callback）,callback返回结果");
		addContext(this, "2.有依赖方法参数为（results, callback）,resutls为所依赖方法结果映射");
		addContext(this, "3.所有函数执行完毕后执行最终回调方法（err,results）,中途抛出错误，流程立即停止");
		var laugh = function(callback){
			callback(null,"laughing....");
		}
		var cry = function(callback){
			callback(null,"cry.....");
		}	
		return coll.test_auto({
			laugh : laugh,
			cry : cry,
			eat : ["laugh","cry",function(results,callback){
				console.log(results);
				callback(null,"eat all..");
			}]
		},2).then(function(data,err){
			expect(data).to.be.an("Object");
		});
	});

	it("autoInject【依赖注入】测试：auto的依赖注入版本",function(){
		addContext(this, "相较于auto有更纯净的语法糖，自动注入将依赖方法的结果作为参数直接传递");
		var laugh = function(callback){
			callback(null,"laughing....");
		}
		var cry = function(callback){
			callback(null,"cry.....");
		}	
		return coll.test_autoInject({
			laugh : laugh,
			cry : cry,
			eat : ["laugh","cry",function(laugh,cry,callback){
				console.log("laugh:"+laugh);
				console.log("cry:"+cry);
				callback(null,"eat all..");
			}]
		}).then(function(data,err){
			expect(data).to.be.an("Object");
		});
	})
});
 
