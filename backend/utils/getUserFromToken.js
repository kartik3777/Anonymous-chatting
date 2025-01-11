const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const User = require("../models/userModel");

 async function getUserFromToken (token) {
    // try {
        // Verify the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if the user still exists
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            throw new Error("The user belonging to this token no longer exists");
        }

        // Check if the user changed the password after the token was issued
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            throw new Error("User recently changed the password. Please log in again.");
        }

        return freshUser;
    // } catch (error) {
    //     // Handle any errors (e.g., invalid token, database query issues)
    //     throw new Error(`Error while verifying token: ${error.message}`);
    // }
};

module.exports = getUserFromToken;
// exports.default = getUserFromToken
