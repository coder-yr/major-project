const User = require("../models/user")

module.exports.renderSignUpform = async (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.SignUp = async(req,res) => {
    try{
    let { username, email, password } = req.body; 
    const newUser = new User({email,username});
    const registeredUser = await  User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser , (err) => {
        if(err){
            return next(err);
        }
     req.flash("success","Welcome to wanderlust!");
    res.redirect("/listings")
    })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}


module.exports.renderLoginform = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.Login =  async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/Listings" ;
    res.redirect(redirectUrl);
}

module.exports.LogOut =  (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    })
}
