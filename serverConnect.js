var http = require('http');
var connect = require('connect');

var rest = require('connect-rest');
var connectApp = connect()
    .use( connect.query() )
    .use( connect.urlencoded() )
    .use( connect.json() )
    .use(connect.static('static/'))
;

// rest services and variables
var _tasks = [],
    _taskId = 0,
    _users = {
        "admin": {user:"admin", password:"admin"}
    },
    _registeredUsers = ["admin"],
    apiK = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';

var response = function (data, status, message) {
    var result = {
        data: data || {},
        status: status || "OK",
        message: message || ""
    };
    return result;
}

rest.get( '/tasks', function( request, content ){
    return response(_tasks);
});

rest.post( '/tasks', function( request, content ){
    var t = content.data;
    t.id = _taskId++;
    _tasks.push(t);
    return response(t);
});

rest.put( '/tasks', function( request, content ){
    _tasks = content.data;
    return response();
});

rest.del( '/tasks/:id', function( request, content ){
    for (var i = 0; i < _tasks.length; i++) {
        if (_tasks[i].id == request.parameters.id) {
            _tasks.splice(i, 1);
            break;
        }
    }
    return response();
});

rest.post( { path: '/users', unprotected: true }, function( request, content ){
    console.log(_registeredUsers.indexOf(content.data.user));
    if (_registeredUsers.indexOf(content.data.user) >= 0) {
        return response(null, "FAIL", "That user already exists");
    } else {
        _users[content.data.user] = content.data;
        _registeredUsers.push(content.data.user)
        return response();
    }
});

rest.post( { path: '/login', unprotected: true }, function( request, content ){
    var credential = _users[content.data.user] || {};
    if (credential.password != content.data.password) {
        return response(null, "FAIL", "Your credentials are invalid");
    } else {
        credential.apiKey = apiK;
        return response(credential);
    }
});

// adds connect-rest middleware to connect
var options = {
    'apiKeys': [ apiK ]
};
connectApp.use( rest.rester( options ) );

http.createServer(connectApp).listen(8080);