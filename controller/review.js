const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.CreateReview = async(req,res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id ;
    console.log(newReview);
    listing.reviews.push(newReview);
    console.log(req.params);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    console.log("Review is sucessfully saved"); 
     res.redirect(`/Listings/${listing._id}`);
}

module.exports.DestroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/Listings/${id}`);
}


