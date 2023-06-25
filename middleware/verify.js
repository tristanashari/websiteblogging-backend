const db = require("../models")

module.exports = {
    async checkVerify(req, res, next) {
        try { 
            const user = await db.User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if(!user.isVerified){
                res.status(400).send({
                    message: "Please verify your account first to continue"
                })
                return
            }
            next()
        } catch(error) {
            res.status(500).send({
                message:"server error",
                error: error
            })
        }
    },
}