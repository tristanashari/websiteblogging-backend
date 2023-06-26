const db = require("../models")
const bcrypt = require("bcryptjs")
const transporter = require("../helpers/Transporter")
const jwt = require("jsonwebtoken")
const hbars = require("handlebars")
const fs = require("fs")
const crypto = require("crypto")

const { User } = db
const secretKey = process.env.JWT_SECRET_KEY

module.exports = {
    async register(req, res) {
        const { email, username, phoneNumber, password } = req.body
        try {
            const isExist = await User.findOne({
                where: {
                    [db.Sequelize.Op.or]: [{email}, {username}, {phoneNumber}]
                } 
            })
            if(isExist) {
                res.status(400).send({
                    message: "email/username/phoneNumber is already registered"
                })
                return
            }

            const verifyToken = crypto.randomBytes(16).toString("hex")

            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(password, salt)

            const newUser = await User.create({
                email,
                username,
                phoneNumber,
                password: hashPass,
                verifyToken
            })
            
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

            res.status(201).send({
                message: "Your account has been registered",
                data: {
                    email: newUser.email,
                    username: newUser.username,
                    phoneNumber: newUser.phoneNumber
                }
            })
        } catch(error) {
            console.log(error)
            res.status(500).send({
                message: "server error",
                error: error.message
            })
        }
    },
    async login(req, res) {
        const { user_identification, password } = req.body
        try{
            const user = await User.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        {email: user_identification},
                        {username: user_identification},
                        {phoneNumber: user_identification}]
                }
            })
            if (!user) {
                res.status(400).send({
                    message: "Login failed. Please input your registered email, username, or phone number"
                })
                return
            }

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return res.status(400).send({
                    message: "Login failed. Incorrect password"
                })
            }

            const payload = { id : user.id }
            const token = jwt.sign(payload, secretKey, {
                expiresIn: "24h"
            })

            res.status(200).send({
                message: "You are logged in!",
                data: user,
                accessToken: token,
            })
        } catch(error) {
            res.status(500).send({
                message: "server error",
                error: error.message
            })
        }
        
    },
    async verifyAccount(req, res) {
        const token = req.body.verifyToken
        try {
            const userData = await db.User.findOne({
                where: {
                    verifyToken: token
                }
            })
            if(!userData){
                return res.status(400).send({
                    message: "Invalid verification token"
                })
            }
            if(userData.isVerified){
                return res.status(400).send({
                    message: "Account is already verified"
                })
            }

            userData.isVerified = true
            await userData.save()

            res.status(200).send({
                message: "Verified"
            })
        } catch(error) {
            res.status(500).send({
                message: "server error",
                error: error.message
            })
        }
    },
    async forgotPass(req, res) {
        const { email } = req.body
        try{
            const userData = await db.User.findOne({
                where: { email }
            })
            if(!userData) {
                return res.status(400).send({
                    message:"User not found"
                })
            }

            const forgotToken = crypto.randomBytes(16).toString("hex")
            const username = userData.username

            const link = `${process.env.FE_BASEPATH}/reset-password/${forgotToken}`
            const template = fs.readFileSync("./template/forgotpass.html", "utf-8")
            const templateCompile = hbars.compile(template)
            const registerEmail = templateCompile({username, link})

            await transporter.sendMail({
                from: "WriteLn Blogging",
                to: email,
                subject: "Reset Your Password",
                html: registerEmail
            })

            userData.forgotToken = forgotToken
            await userData.save()

            res.status(200).send({
                message: "Check your email to reset your password"
            })
        } catch(error) {
            res.status(error).send({
                message: "server error",
                error: error.message
            })
        }
    },
    async resetPass (req, res) {
        const { token, password } = req.body

        try {
            const userData = await db.User.findOne({
                where: {forgotToken: token}
            })
            if(!userData) {
                return res.status(400).send({
                    message: "Invalid token"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(password, salt) 
            
            userData.password = hashPass
            userData.forgotToken = null
            await userData.save()

            res.status(200).send({
                message: "Password has been resetted"
            })
        } catch(error) {
            res.status(500).send({
                message: "server error",
                error: error.message
            })
        }
    }
}