var hapi = require('hapi');
var https = require('https');
var server = hapi.createServer(4000);
var socketIO = require('socket.io');

var io = socketIO.listen(server.listener);

server.route({
    method: 'GET',
    path: '/api/me',
    handler: function (req, reply) {
        io.emit('me', 'Brad Leupen');
        var auth = req.headers.authorization;
        var request = https.request('https://www.googleapis.com/plus/v1/people/me', reply);
        request.setHeader('Authorization', auth);
        request.end();
    }
});

io.sockets.on('connection', function (socket) {
    console.log('token: '+socket.handshake.query.token);
    socket.emit('me', 'Brad Leupen');
    socket.on('friends', function (fn) {
        fn(['Hank Leupen', 'Christa Leupen']);
    });
});

server.start(function () {
    console.log('Server started at ' + server.info.uri);
});
