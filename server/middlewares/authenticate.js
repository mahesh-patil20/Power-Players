const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        req.email = verifyUser.email;
        next();
    }
    catch (error) {
        res.status(401).send({error: 'Please login to continue'});
    }
}

module.exports = authenticate;