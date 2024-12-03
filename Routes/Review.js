const express = require("express");
const router = express.Router({mergeParams : true});
const WrapAsync = require("../Utilis/Wrapsync.js");
const ExpressError = require("../Utilis/ExpressError.js");
const{validateReview , isLoggedIn , isReviewAuthor } = require("../middleware.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controller/review.js")
//Reviews
//post route
router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.CreateReview));


//Delete review route
router.delete("/:reviewId", isLoggedIn ,isReviewAuthor , WrapAsync(reviewController.DestroyReview))


module.exports = router;