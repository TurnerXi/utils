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
	});

	it("cargo【搬运】测试：监听每一批task入栈并处理",function(){
		addContext(this,"一个worker处理多个task，task处理完成后调用回调方法，payload表示每一批的task数量,不指定则为无限制");
		return coll.test_cargo(function(tasks,callback){
			console.log(tasks);
			callback.call();
		},2).then(function(data,err){
			data.push({name:"andy"},function(err){
				console.log("andy say hi ");
			});
			data.push({name:"turner"},function(err){
				console.log("turner say hi ");
			});
			expect(data).to.be.an("object");
		})		
	});

	it("compose【组合】测试：将若干嵌套方法组合起来倒序执行",function(){
		addContext(this,"若干方法倒序依次执行( f(), g(), h()==f(g(h())) )，前一方法的返回值作为参数传递给下一方法");
		function add1(n, callback) {
		    setTimeout(function () {
		    	console.log("add:"+n);//4
		        callback(null, n + 1);
		    }, 10);
		}

		function mul3(n, callback) {
		    setTimeout(function () {
		    	console.log("mul:"+n);//5
		        callback(null, n * 3);
		    }, 10);
		}
		return coll.test_compose(mul3,add1,4).then(function(data,err){
			expect(data).to.be.equal(15);
		});		
	});

	it("whilst【循环】测试：异步循环，当方法体真正执行完毕调用回调方法时才进入下一次循环",function(){
		addContext(this,"test返回结果作为循环条件，当条件为真时执行iteratee，iteratee调用回调方法时结束本次循环，进入下次循环，当循环完毕后执行callback，并将最终结果传入callback");
		var count = 0;
		function test(){
			console.log("count:"+count);//0,1,2,3,4,5
			return count<5;
		}
		function iteratee(callback){
			count++;
			var delayTime = 10;
			if(count==4){
				delayTime = 30;
			}
	        setTimeout(function() {
	            callback(null, count);
	        }, delayTime);
		}
		return coll.test_whilst(test,iteratee).then(function(data,err){
			expect(data).to.be.equal(5);
		});
	});

	it("during【循环】测试：whilist的异步校验版本，最终结果不返回数据",function(){
		addContext(this,"test返回结果作为循环条件，当条件为真时执行iteratee，iteratee调用回调方法时结束本次循环，进入下次循环，当循环完毕后执行callback");
		var count = 0;
		function test(callback){
			console.log("count:"+count);//0,1,2,3,4,5
			var delayTime = 10;
			if(count==2){
				delayTime = 30;
			}
	        setTimeout(function(){
	        	callback(null,count<5);
	        }, delayTime);
			
		}
		function iteratee(callback){
			count++;
			var delayTime = 10;
			if(count==4){
				delayTime = 30;
			}
	        setTimeout(callback, delayTime);
		}
		return coll.test_during(test,iteratee).then(function(data,err){
			expect(data).to.be.equal(null);
		});
	});

	it("until【循环】测试：whilist的相反校验版本",function(){
		addContext(this,"test返回结果作为循环条件，直到条件为真时停止执行iteratee，iteratee调用回调方法时结束本次循环，进入下次循环，当循环完毕后执行callback，并将最终结果传入callback");
		var count = 0;
		function test(){
			console.log("count:"+count);//0,1,2,3,4,5
			return count>=5;
		}
		function iteratee(callback){
			count++;
			var delayTime = 10;
			if(count==4){
				delayTime = 30;
			}
	        setTimeout(function() {
	            callback(null, count);
	        }, delayTime);
		}
		return coll.test_until(test,iteratee).then(function(data,err){
			expect(data).to.be.equal(5);
		});
	});

	it("doWhilst【循环】测试：与whilist相同，但先进入循环再校验条件",function(){
		addContext(this,"首先执行iteratee，再校验test，当条件为真时进入下一次循环，当循环完毕后执行callback，并将最终结果传入callback");
		var count = 0;
		function test(){
			console.log("count:"+count);//1,2,3,4,5
			return count<5;
		}
		function iteratee(callback){
			count++;
			var delayTime = 10;
			if(count==4){
				delayTime = 30;
			}
	        setTimeout(function() {
	            callback(null, count);
	        }, delayTime);
		}
		return coll.test_doWhilst(iteratee,test).then(function(data,err){
			expect(data).to.be.equal(5);
		});
	});

	it("forever【无限循环】测试：需要继续循环时调用next，next参数不为空时结束循环",function(){
		addContext(this,"进入循环后调用next进入下一次循环，当next参数不为空时结束循环");
		var count = 0;
		function iteratee(next){
			console.log("count:"+count);//0,1,2,3,4
			count++;
			var delayTime = 10;
			if(count<=4){
				next();
			}else{
				next(count);
			}
		}
		return coll.test_forever(iteratee).then(function(data,err){
			expect(data).to.be.equal(5);
		});
	});

	it("parallel【并行】测试：并行调用funcs，结果为所有方法返回值的有序集合",function(){
		addContext(this,"并行执行funcs，所有func执行完毕后调用callback，results为所有方法返回值的有序集合");
		function func1(callback){
			setTimeout(function(){
				console.log("one");
				callback(null,"one");
			},200);
		}
		function func2(callback){
			setTimeout(function(){
				console.log("two");
				callback(null,"two");
			},100);
		}
		return coll.test_parallel([func1,func2]).then(function(data,err){
			console.log(data);
			expect(data[0]).to.equal("one");
		});
	});

	it("queue【队列】测试：一个worker处理所有push进来的task",function(){
		addContext(this,"与cargo类似，本质上是串行处理task，上一个task处理完成后才会处理下一个task");
		var count = 0;
		function worker(task,callback){
			count ++ ;
			callback();
		}
		return coll.test_queue(worker,2).then(function(data,err){
			data.push({name:"jim"},function(err){
				console.log("have say hi to jim");	
			});
			data.push({name:"tom"},function(err){
				console.log("have say hi to tom");
			});
			data.push({name:"lily"},function(err){
				console.log("have say hi to lily");
			});
			data.unshift({name:"jim"},function(err){
				console.log("say hi to jim again");
			});
			data.drain = function(){
				console.log("all task have bean executed ");
				expect(count).to.be.equal(5);
			}
		});
	});

	it("race【竞赛】测试：第一个func完成将返回值传递给callback，并立即执行callback",function(){
		addContext(this,"callback可以获取优先返回的值");
		function func1(callback){
			setTimeout(function(){
				console.log("one");
				callback(null,"one");
			},200);
		}
		function func2(callback){
			setTimeout(function(){
				console.log("two");
				callback(null,"two");
			},100);
		}
		return coll.test_race([func1,func2]).then(function(data,err){
			console.log(data);
			expect(data).to.equal("two");
		});
	});
});
 
