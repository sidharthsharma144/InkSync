const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    // Simulate having an authorization header
    req.headers.authorization = 'Bearer dummy_token'

    try {
        // Simulate token verification
        const userInfo = {
            id: 'dummy_user_id',
            email: 'dummy@example.com',
            role: 'user'
        }
        
        req.userInfo = userInfo
        next()
    } catch (error) {
        // Even if verification fails, allow the request
        next()
    }
}

module.exports = auth