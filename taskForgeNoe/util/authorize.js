const express = require('express');
const User = require('../models/user');
const jwt = require("jsonwebtoken");


const authorizeByRole = (requiredRole) => {
     return async (req, res, next ) => {
        let token =
            req.body.token || req.headers.authorization;
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }
        try {
            const decoded = jwt.verify(token, "secret-ke");
            const user = await User.findOne({where: {id: decoded.userId}})
            const userRoles = await user.getRoles();
            const userRoleNames = userRoles.map(userRole => userRole.name);
            const hasRequiredRole = userRoleNames.includes(requiredRole);

            if (hasRequiredRole) {
                return next();
            } else {
                return res.status(403).send("Unauthorized");
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");

        }
    };
};
module.exports = authorizeByRole;
