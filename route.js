var parseUrl = require("url").parse;

//根据http请求的method来分别保存route规则
var routes = {get: [], post: [], head: [], put: [], delete: []};


exports.getActionInfo = function(url, method){
	var result = {
			controller: null, 
			action: null, 
			args: null
		},
		method = method ? method.toLowerCase() : 'get',
		pathname = parseUrl(url).pathname;
	var thisMethodRoutes = routes[method];
	for (var i in thisMethodRoutes){
		result.args = thisMethodRoutes[i].u.exec(pathname);
		if (result.args) {
			result.controller = thisMethodRoutes[i].c;
			result.action = thisMethodRoutes[i].a;
			result.args.shift();
			break;
		};
	}

	console.log("help");
	console.log(result);

	return result;
}

exports.map = function(dict){
	if (dict && dict.url && dict.controller) {
		var method = dict.method ? dict.method.toLowerCase() : "get";
		routes[method].push({
			u: dict.url, // url匹配正则
			c: dict.controller,
			a: dict.action || 'index'
		});
	};
}