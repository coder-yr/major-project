const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // 'Point' is required for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Post middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    try {
      // Deleting all reviews associated with the listing
      await Review.deleteMany({ _id: { $in: listing.reviews } });
      console.log(`Successfully deleted reviews for listing: ${listing._id}`);
    } catch (err) {
      console.error(`Error deleting reviews for listing: ${listing._id}`, err);
    }
  } else {
    console.log(`No listing found to delete reviews for.`);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
