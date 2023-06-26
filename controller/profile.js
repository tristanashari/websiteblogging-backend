const db = require("../models")
const transporter = require("../helpers/Transporter")
const hbars = require("handlebars")
const fs = require("fs")
const crypto = require("crypto")

module.exports = {
    async getProfile(req, res) {
        try { 
            const user = await db.User.findOne({
                where: {
                    id: req.user.id
                }
            })
            res.status(200).send({
                message:"Successfully get profile",
                data: user
            })
        } catch(error) {
            res.status(500).send({
                message:"server error",
                error: error.message
            })
        }
    },
    async updateProfile(req,res) {
        const userID = req.user.id
        const { email, username, phoneNumber } = req.body

        try {
            const isExist = await db.User.findOne({
                where: {
                    [db.Sequelize.Op.or]: [{email}, {username}, {phoneNumber}]
                } 
            })
            if(isExist) {
                res.status(400).send({
                    message: "email/username/phoneNumber is already used"
                })
                return
            }

            const userData = await db.User.findOne({
                where: {
                    id: userID
                }
            })
            if(email){
                const verifyToken = crypto.randomBytes(16).toString("hex")

                const link = `${process.env.FE_BASEPATH}/verify/${verifyToken}`
                const template = fs.readFileSync("./template/registeremail.html", "utf-8")
                const templateCompile = hbars.compile(template)
                const registerEmail = templateCompile({username, link})

                await transporter.sendMail({
                    from: "WriteLn Blogging",
                    to: email,
                    subject: "You have registered to WriteLn",
                    html: registerEmail
                })

                userData.email = email
                userData.verifyToken = verifyToken
                userData.isVerified = false
            }
            if(username){
                userData.username = username
            }
            if(phoneNumber){
                userData.phoneNumber = phoneNumber
            }

            await userData.save()

            res.status(200).send({
                message: "Data has been updated",
                data: userData
            })
        }catch(error) {
            res.status(500).send({
                message: "server error",
                error: error.message
            })
        }
    }
}
