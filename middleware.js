const Listing = require("./models/listing");
const Review = require("./models/review.js")
const {listingSchema } = require("./Schema.js")
const ExpressError = require("./Utilis/ExpressError.js");
const { reviewSchema} = require("./Schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.path , ".." , req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","you must be logged in ");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}


module.exports.isOwner =async (req,res,next) => {
    let {id} = req.params ;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/Listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errmsg)
    }
    else{
        next();
    }
}

module.exports. validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errmsg)
    }
    else{
        next();
    }
 }

 module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    // Fetch the review
    const review = await Review.findById(reviewId).populate("author");
    console.log("Fetched Review:", review);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/Listings/${req.params.id}`);
    }

    // Check if the logged-in user is the author
    console.log("Review Author:", review.author, "Current User:", req.user._id);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/Listings/${req.params.id}`);
    }

    next();
};
