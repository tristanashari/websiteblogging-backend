const router = require("express").Router()
const checkVerify = require("../middleware/verify")
const authMiddleware = require("../middleware/auth")
const multerUpload = require("../middleware/multer");
const { blog: blogController } = require("../controller")

router.get("/", blogController.getAllBlog)
router.post("/", authMiddleware.verifyToken, checkVerify.checkVerify, multerUpload.single("file"), blogController.createBlog)

module.exports = router