var Service = require('./systemService.js');
var http = require("http");
var path = require("path");
var fs = require("fs");

var options = {
    name: "fd-Server",
    description: "The nodejs web server. express_fdserver. ",
    script: path.join(__dirname, "sysMaster.js")
};

function start(){
    // console.log(options);
    //这里如果服务已经注册并处于开启状态，那么应该是只需要发送一个请求即可。
    //但目前不知道如何判定服务是否已经注册并且已启动的状态。
	http.get("http://127.0.0.1:8123/?type=start",function(res){
		console.log('服务已经启动');	
		process.exit();
	}).on('error',function(){
		Service.getService(options, function (svc){
    	    console.log("服务已注册，开启启动...");
			svc.on('start',function(){
				http.get("http://127.0.0.1:8123/?type=start").on('error',function(){
					svc.emit('start');	
				});
			});
    	    svc.start();
    	});
	});
}

function stop(){
    http.get("http://127.0.0.1:8123/?type=stop");
}

function removeService(){
    Service.remove(options);
}

function open(){
    require("../server/index.js").start();
}

module.exports = function (options){
    options = options || {};
    var type = options.type || "";
    
    if(type === "start"){
        start();
    }
    
    if(type === "stop"){
        stop();
    }
    
    if(type === "open"){
        open();
    }
    
    if(type === "removeService"){
        removeService();
    }
};