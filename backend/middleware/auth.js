const jwt = require('jsonwebtoken');

function auth(req,res,next) {
    const token = req.header('x-auth-token');
    
    if(!token) {
        res.status(401).json({ msg: 'Not authorised' });
    }

    try{
        const decoded = jwt.verify(token , 'nickinack');
        console.log(decoded);
        req.user = decoded;
        next();
    }
    catch(e){
        res.status(400).json({ msg: 'Not a valid Token' });
    }
    
}
module.exports = auth;