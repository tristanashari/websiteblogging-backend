const {auth: authController} = require("../controller")
const authValidator = require("../middleware/validation/auth")
const router = require("express").Router()

router.post("/register", authValidator.validateRegister, authController.register)
router.post("/", authController.login)
router.patch("/verify", authController.verifyAccount)
router.post("/forgot", authController.forgotPass)
router.post("/reset", authValidator.validateResetPass, authController.resetPass)

module.exports = router