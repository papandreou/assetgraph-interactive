var express = require('express'),
    DNode = require('dnode'),
    _ = require('underscore');

module.exports = function (options) {
    options = options || {};

    return function (assetGraph, cb) {
        var port = options.port || 3000,
            app = express.createServer();

        app.use(express.static(__dirname + '/../http-pub/'));
        app.listen(port);

        console.warn('Please go to http://127.0.0.1:' + port + '/');

        DNode(function (client, connection) {
            return {
                startObserving: function (startUrl) {
                    console.warn(client, connection);
                    ['addAsset', 'removeAsset', 'addRelation', 'removeRelation'].forEach(function (eventName) {
                        assetGraph.on(eventName, function (relationOrAsset) {
                            console.warn('relaying ' + eventName + ' event to client');
                            var obj = {};
                            _.each(relationOrAsset, function (value, key) {
                                if (key === 'url' || key === 'type' || key === 'id') {
                                    obj[key] = value;
                                } else if (key === 'to' || key === 'from') {
                                    obj[key] = {id: value.id};
                                }
                            });
                            client[eventName](obj);
                        });
                    });
                    cb();
                }
            };
        }).listen(app);
    };
}
