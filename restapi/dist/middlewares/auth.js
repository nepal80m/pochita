"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'this is a very very secret key!';
const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(' ')[1];
            let user = jwt.verify(token, SECRET_KEY);
            req.userId = user.id;
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = auth;
