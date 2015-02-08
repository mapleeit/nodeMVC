var http = require('http'),
    events = require("events");

exports.index = function(){
    this.render('blog/index.html', {msg:'Hello World'});
};



//创建一个EventEmitter的实例
var tweets_emitter = new events.EventEmitter();

function get_tweets() {
	var options = {
		method: "GET",
		port: 80,
		hostname: "api.t.sina.com.cn",
		path: "/statuses/public_timeline.json?source=3243248798"
	}

	var request = http.request(options);

	request.addListener("response", function(response) {
		var body = "";
		response.addListener("data", function(data) {
			body += data;
		});

		response.addListener("end", function() {
			var tweets = JSON.parse(body);
			if(tweets.length > 0) {
			    //这里发出事件调用
				tweets_emitter.emit("tweets", tweets);
			}
		});
	});

	request.end();
};

// action: tweets
exports.tweets = function(blogType){
        this.render('blog/tweets.html');
};

// action: tweets_data
exports.tweets_data = function(blogType){
    var _t = this;
    //注册一个一次性的事件监听
    var listener = tweets_emitter.once("tweets", function(tweets) {  
        _t.render('blog/tweets_data.html', {tweets: tweets});
    });
  
    get_tweets();
};

