var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
mongoose.connect('mongodb://scyrizales:testing123@ds053858.mongolab.com:53858/todos');
var Task     = require('./app/models/task');

app.use(bodyParser());
app.use(express.static('static/'))

var port = process.env.PORT || 8080;

var taskRouter = express.Router();
var securityRouter = express.Router();

var _taskId = 0,
    _users = {
        "admin": {user:"admin", password:"admin"}
    },
    _registeredUsers = ["admin"],
    response = function (data, status, message) {
        var result = {
            data: data || {},
            status: status || "OK",
            message: message || ""
        };
        return result;
    },
    guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    },
    checkAuth = function(req, res, next) {
        var credential = _users[req.session.user] || {};
        if (req.session.apiKey && req.session.apiKey === credential.apiKey) {
            next();
        } else {
            res.status(401).send('You are not authorized to view this page');
        }
    };

taskRouter.use(checkAuth);

taskRouter.get('', function ( req, res ){
    Task.find(function(err, tasks) {
        if (err)
            res.json(response(null, "FAIL", err));
        else
            res.json(response(tasks));
    });
});

taskRouter.post('', function ( req, res ){
    var t = req.body.data;
    t.id = _taskId++;

    var task = new Task(t);

    task.save(function(err) {
        if (err)
            res.json(response(null, "FAIL", err));
        else
            res.json(response(t));
    });
});

taskRouter.put('', function ( req, res ){
    var _tasks = req.body.data;
    for (var i = 0; i < _tasks.length; i++) {
        delete _tasks[i]._id;
        Task.update({ id: _tasks[i].id }, _tasks[i], function(err) {
            if (err)
                res.json(response(null, "FAIL", err));
            else
                res.json(response());
        });
    }
});

taskRouter.delete('/:id', function ( req, res ){
    Task.remove({
        id: req.params.id
    }, function(err, task) {
        if (err)
            res.json(response(null, "FAIL", err));
        else
            res.json(response());
    });
});

securityRouter.post( '/users', function ( req, res ){
    var credential = req.body.data;
    if (_registeredUsers.indexOf(credential.user) >= 0) {
        res.json(response(null, "FAIL", "That user already exists"));
    } else {
        _users[credential.user] = credential;
        _registeredUsers.push(credential.user)
        res.json(response());
    }
});

securityRouter.post('/login', function ( req, res ){
    var sentCredential = req.body.data;
    var credential = _users[sentCredential.user] || {};
    if (credential.password != sentCredential.password) {
        res.json(response(null, "FAIL", "Your credentials are invalid"));
    } else {
        req.session.user = credential.user;
        req.session.apiKey = guid();
        res.json(response(credential));
        credential.apiKey = req.session.apiKey;
    }
});

securityRouter.post('/logout', function ( req, res ) {
    delete req.session.user;
    delete req.session.apiKey;
});

app.use(cookieParser());
app.use(session({ secret: 'task app key', cookie: { maxAge: 60000 }}));
app.use('/tasks', taskRouter);
app.use('/', securityRouter);

app.listen(port);
console.log('Listening on: ' + port);