const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    let token =
        req.body.token || req.headers.authorization;
    console.log("TOKEN:" + token);

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    try {
        const decoded = jwt.verify(token, "secret-ke");
        req.user = decoded;
    } catch (err) {
        console.log(err);
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;