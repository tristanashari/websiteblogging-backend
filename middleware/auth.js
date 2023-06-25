const jwt = require("jsonwebtoken")
const secretKey = process.env.JWT_SECRET_KEY

module.exports = {
    async verifyToken(req, res, next) {
        const { authorization } = req.headers
        if (!authorization) {
            res.status(401).send({
                message: "Token not found"
            })
            return
        }

        const [format, token] = authorization.split(" ")
        if (format.toLowerCase() == "bearer"){
            try {
                const payload = jwt.verify(token, secretKey)
                if (!payload) {
                    res.status(401).send({
                        message: "Failed to verify token"
                    })
                    return
                }
                req.user = payload
                next()
            }catch(error){
                res.status(401).send({
                    message:"Invalid token",
                    error: error
                })
            }
        }
    }
}