const jwt = require('jsonwebtoken');

function auth_applicant(req,res,next) {
    const token = req.header('x-auth-token');

    if(!token) res.status(401)
}