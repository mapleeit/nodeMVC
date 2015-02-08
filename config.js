var route = require("./route");

route.map({
    method:'get',
    url: /^\/\/?$/i, // i参数：对大小写区分不敏感
    controller: 'blog',
    action: 'index'
});
route.map({
    method:'get',
    url: /^\/blog\/?$/i, // i参数：对大小写区分不敏感
    controller: 'blog',
    action: 'index'
});
route.map({
    method:'get',
    url: /^\/tweets\/?$/i, // i参数：对大小写区分不敏感
    controller: 'blog',
    action: 'tweets'
});
route.map({
    method:'get',
    url: /^\/tweets_data\/?$/i,
    controller: 'blog',
    action: 'tweets_data'
});

exports.staticFileDir = "static";