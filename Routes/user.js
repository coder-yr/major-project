const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../Utilis/Wrapsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

router.route("/signup")
.get(userController.renderSignUpform)
.post( WrapAsync(userController.SignUp));


router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl ,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), 
 userController.Login
);



router.get("/logout" ,userController.LogOut);

module.exports = router ; 