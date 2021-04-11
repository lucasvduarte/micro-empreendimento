const jwt = require("jsonwebtoken");
const TOKEN_SECRET = require("../config/jwtsecret");

const authValidation = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            success: false,
            error: "Access denied"
        });
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).send({
            success: false,
            error: "Token error"
        });
    }


    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({
            success: false,
            error: "Token malformatted"
        });
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token invalid" });
        // console.log(decoded)
        req.userId = decoded.token;
        return next();
    });
};

module.exports = authValidation;