const router = require("express").Router()
const checkVerify = require("../middleware/verify")
const authMiddleware = require("../middleware/auth")
const multerUpload = require("../middleware/multer");
const { blog: blogController } = require("../controller");
const { check } = require("express-validator");

router.get("/", blogController.getAllBlog)

router.post("/", 
authMiddleware.verifyToken, 
checkVerify.checkVerify, 
multerUpload.single("file"), 
blogController.createBlog)

router.get("/like/:id", 
authMiddleware.verifyToken, 
checkVerify.checkVerify, 
blogController.likeBlog)

router.get("/most-favorite", 
authMiddleware.verifyToken, 
checkVerify.checkVerify, 
blogController.mostFavorite)

router.get("/user-blog", 
authMiddleware.verifyToken, 
checkVerify.checkVerify, 
blogController.getMyBlog)

router.get("/user-favorite",
authMiddleware.verifyToken,
checkVerify.checkVerify,
blogController.getLikedBlog)


module.exports = router