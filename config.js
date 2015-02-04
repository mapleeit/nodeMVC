var route = require("./route");

route.map({
    method:'get',
    url: /^\/index\/?$/i,
    controller: 'index',
    action: 'index'
});

exports.staticFileDir = "static";