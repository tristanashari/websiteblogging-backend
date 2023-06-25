const router = require("express").Router()
const authMiddleware = require("../middleware/auth")
const { profile: profileController } = require("../controller")

router.use(authMiddleware.verifyToken)
router.get("/", profileController.getProfile)
router.patch("/", profileController.updateProfile)

module.exports = router