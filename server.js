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
		
	};
}