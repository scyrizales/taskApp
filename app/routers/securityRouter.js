var securityRouter = express.Router();

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
