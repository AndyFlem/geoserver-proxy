var proxy = require('express-http-proxy');
var app = require('express')();
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false });

 
app.use('/geoserver', proxy('gis.westernpower.org', {
    proxyReqPathResolver: function (req) {
        var parts = req.url.split('?');
        return '/geoserver/' + req.url;
    },
    userResDecorator: function(proxyRes, proxyResData,userReq, userRes) {
        console.dir(userReq.query);
        return new Promise(function(resolve) {
            parser.parseString(proxyResData, function (err, result) {
                userRes.set('Content-Type', 'application/json');
                resolve(JSON.stringify(result));
            });
        });
  }
}));

app.listen(3000)