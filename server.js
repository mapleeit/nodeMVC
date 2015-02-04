require("./refLib/Shotenjin");
var http = require("http"),
	querystring = require("querystring"),
	path = require("path"),
	url = require("url"),
	fs = require("fs"),

	route = require("./route"),
	config = require("./config");

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
			controller[actionInfo.action].apply(context, actionInfo.args);
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
controllerContext.prototype.render = function(request, response, viewName, context) {
	viewEngine.render(request, response, viewName, context);
};
controllerContext.prototype.renderJson = function(response, json) {
	viewEngine.renderJson(response, json);
};


/*
 * handle404 AND handle500
 */
var handle404 = function(request, response) {
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.end("Page not found");
}
var handle500 = function(request, response, error) {
	response.writeHead(500, {"Content-Type": "text/plain"});
	response.end(error);
}


/*
 * viewEngine字面量
 */
var viewEngine = {
	render : function(request, response, viewName, context) {
		var filename = path.join(__dirname, "views", viewName);
		try {
			var output = Shotenjin.renderView(filename, context);
		}catch(error) {
			handle500(request, response, error);
			return;
		}
		response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(output);
	},
	renderJson : function(response, json){
		// TODO:
	}
}


/*
 * staticFileServer
 */
var staticFileServer = function(request, response, filepath) {
	

	console.log("****Here is staticFileServer");


	if (!filepath) {
		filepath = path.join(__dirname, config.staticFileDir, url.parse(request.url).pathname);
	};
	fs.exists(filepath, function(exists) {


		console.log("**** FILEPATH : " + filepath);


		if (!exists) {
			handle404(request, response);
			return;
		};

		fs.readFile(filepath, "binary", function(error, file){
			if (error) {
				handle500(request, response, error);
				return;
			}

			var ext = path.extname(filepath);
			ext = ext ? ext.slice(1) : "html";
			response.writeHead(200, {"Content-Type" : contentTypes[ext] || "text/html"});
			response.write(file, "binary");
			response.end();
		})
	});
}


var contentTypes = {
  "aiff": "audio/x-aiff",
  "arj": "application/x-arj-compressed",
  "asf": "video/x-ms-asf",
  "asx": "video/x-ms-asx",
  "au": "audio/ulaw",
  "avi": "video/x-msvideo",
  "bcpio": "application/x-bcpio",
  "ccad": "application/clariscad",
  "cod": "application/vnd.rim.cod",
  "com": "application/x-msdos-program",
  "cpio": "application/x-cpio",
  "cpt": "application/mac-compactpro",
  "csh": "application/x-csh",
  "css": "text/css",
  "deb": "application/x-debian-package",
  "dl": "video/dl",
  "doc": "application/msword",
  "drw": "application/drafting",
  "dvi": "application/x-dvi",
  "dwg": "application/acad",
  "dxf": "application/dxf",
  "dxr": "application/x-director",
  "etx": "text/x-setext",
  "ez": "application/andrew-inset",
  "fli": "video/x-fli",
  "flv": "video/x-flv",
  "gif": "image/gif",
  "gl": "video/gl",
  "gtar": "application/x-gtar",
  "gz": "application/x-gzip",
  "hdf": "application/x-hdf",
  "hqx": "application/mac-binhex40",
  "html": "text/html",
  "ice": "x-conference/x-cooltalk",
  "ief": "image/ief",
  "igs": "model/iges",
  "ips": "application/x-ipscript",
  "ipx": "application/x-ipix",
  "jad": "text/vnd.sun.j2me.app-descriptor",
  "jar": "application/java-archive",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "latex": "application/x-latex",
  "lsp": "application/x-lisp",
  "lzh": "application/octet-stream",
  "m": "text/plain",
  "m3u": "audio/x-mpegurl",
  "man": "application/x-troff-man",
  "me": "application/x-troff-me",
  "midi": "audio/midi",
  "mif": "application/x-mif",
  "mime": "www/mime",
  "movie": "video/x-sgi-movie",
  "mp4": "video/mp4",
  "mpg": "video/mpeg",
  "mpga": "audio/mpeg",
  "ms": "application/x-troff-ms",
  "nc": "application/x-netcdf",
  "oda": "application/oda",
  "ogm": "application/ogg",
  "pbm": "image/x-portable-bitmap",
  "pdf": "application/pdf",
  "pgm": "image/x-portable-graymap",
  "pgn": "application/x-chess-pgn",
  "pgp": "application/pgp",
  "pm": "application/x-perl",
  "png": "image/png",
  "pnm": "image/x-portable-anymap",
  "ppm": "image/x-portable-pixmap",
  "ppz": "application/vnd.ms-powerpoint",
  "pre": "application/x-freelance",
  "prt": "application/pro_eng",
  "ps": "application/postscript",
  "qt": "video/quicktime",
  "ra": "audio/x-realaudio",
  "rar": "application/x-rar-compressed",
  "ras": "image/x-cmu-raster",
  "rgb": "image/x-rgb",
  "rm": "audio/x-pn-realaudio",
  "rpm": "audio/x-pn-realaudio-plugin",
  "rtf": "text/rtf",
  "rtx": "text/richtext",
  "scm": "application/x-lotusscreencam",
  "set": "application/set",
  "sgml": "text/sgml",
  "sh": "application/x-sh",
  "shar": "application/x-shar",
  "silo": "model/mesh",
  "sit": "application/x-stuffit",
  "skt": "application/x-koan",
  "smil": "application/smil",
  "snd": "audio/basic",
  "sol": "application/solids",
  "spl": "application/x-futuresplash",
  "src": "application/x-wais-source",
  "stl": "application/SLA",
  "stp": "application/STEP",
  "sv4cpio": "application/x-sv4cpio",
  "sv4crc": "application/x-sv4crc",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tar": "application/x-tar",
  "tcl": "application/x-tcl",
  "tex": "application/x-tex",
  "texinfo": "application/x-texinfo",
  "tgz": "application/x-tar-gz",
  "tiff": "image/tiff",
  "tr": "application/x-troff",
  "tsi": "audio/TSP-audio",
  "tsp": "application/dsptype",
  "tsv": "text/tab-separated-values",
  "txt": "text/plain",
  "unv": "application/i-deas",
  "ustar": "application/x-ustar",
  "vcd": "application/x-cdlink",
  "vda": "application/vda",
  "vivo": "video/vnd.vivo",
  "vrm": "x-world/x-vrml",
  "wav": "audio/x-wav",
  "wax": "audio/x-ms-wax",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "wmx": "video/x-ms-wmx",
  "wrl": "model/vrml",
  "wvx": "video/x-ms-wvx",
  "xbm": "image/x-xbitmap",
  "xlw": "application/vnd.ms-excel",
  "xml": "text/xml",
  "xpm": "image/x-xpixmap",
  "xwd": "image/x-xwindowdump",
  "xyz": "chemical/x-pdb",
  "zip": "application/zip"
};












