module.exports.isLoggedIn = (req, res, next) => {//middleware to authenticate routes--in a seperate file so all this text doesnt have to be added to each route
    if (!req.isAuthenticated()) {//isAuthenticated() function comes with passport
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');//have to return or you will get Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client message--without return the res.render below still runs
    }
next();
}