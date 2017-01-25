// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
var ig = require('instagram-node').instagram();
var redirect_uri = 'http://localhost:8000/oauth/done';
ig.use({ client_id: 'f5285f6d8c68488eb9c2236f17eec121', client_secret: '118b61fae4064840ab8c6f98e419ccfe' });

exports.authorize_user = function(req, res) {
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};