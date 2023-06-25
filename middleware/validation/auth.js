const { body, validationResult } = require("express-validator")

const validate = (validations) => {
    return async (req,res,next) => {
        for (let validation of validations) {
            const result = await validation.run(req)
            if(result.errors.length) break
        }

        const errors = validationResult(req)
        if (errors.isEmpty()){
            return next()
        }

        res.status(400).json({ errors: errors.array() })
    }
}

module.exports = { 
    validateRegister: validate([
        body("email").isEmail(),
        body("username")
            .notEmpty()
            .withMessage("Please fill in username"),
        body("phoneNumber").notEmpty(),
        body("password")
            .isLength({min: 6})
            .withMessage("Password must be at least 6 characters")
            .isStrongPassword({
                minLowercase: 0
            })
            .withMessage("Password must contain at least 1 symbol and 1 uppercase letter")
    ]),
    validateResetPass: validate([
        body("token").notEmpty().withMessage("Please fill in token"),
        body("password")
            .isLength({min: 6})
            .withMessage("Password must be at least 6 characters")
            .isStrongPassword({
                minLowercase: 0
            })
            .withMessage("Password must contain at least 1 symbol and 1 uppercase letter")
    ])
}