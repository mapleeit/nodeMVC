require("./refLib/Shotenjin");
var http = require("http"),
	querystring = require("querystring"),

	route = require("./route");

exports.runServer = function(port) {
	port = port || 8888;
	var server = http.createServer(function(request, response){
		var _postData = "";
		request.on("data", function(chunk){
			_postData += chunk;
		})
		.on("end", function(){
			request.post = querystring.parse(_postData);
			handleRequest(request, response);
		});
	}).listen(port);

	console.log("Http server has runned at http://localhost:" + port + " !");
}

/*
 * 所有请求的统一入口
 */
var handleRequest = function(request, response) {
	// 通过route来获取controller和action信息
	var actionInfo = route.getActionInfo(request.url, request.method);
	//如果route中有匹配的action，则分发给对应的action
	if (actionInfo.action) {
		var controller = require("./controllers/" + actionInfo.controller);
		if (controller[actionInfo.action]) {
			var context = new controllerContext(request, response);
			controller[actionInfo.action].apply(context, action.args);
		}else {
			handle500(request, response, 'Error: controller "' + actionInfo.controller + '" without action "' + actionInfo.action + '"');
		}
	}else {
		//如果route没有匹配到，则当作静态文件处理
        staticFileServer(request, response);
	}
}

/*
 * controller的上下文
 */
var controllerContext = function(request, response) {
	this.request = request;
	this.response = response;
	this.handle404 = handle404;
	this.handle500 = handle500;
}
controllerContext.prototype.render = function() {
	
};
controllerContext.prototype.renderJson = function() {
	
};


var handle404 = function(request, response) {
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.end("Page not found");
}
var handle500 = function(request, response, error) {
	response.writeHead(500, {"Content-Type": "text/plain"});
	response.end(error);
}

/*
 * viewEngine
 */
var viewEngine = {
	render : function(request, response, viewName, context) {

	},
	renderJson : function(response, json){

	}
}



