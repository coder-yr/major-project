const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utilis/Wrapsync.js");
const listingController = require("../controller/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../ClouddConfig.js");
const upload = multer({ storage });

// Route for listing index and creating a new listing
router.route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,WrapAsync(listingController.createListing));
    

// Route to render the "new listing" form
router.get("/new", isLoggedIn, listingController.renderNewform);

// Route for viewing, updating, or deleting a single listing
router.route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        WrapAsync(listingController.UpdateListing)
    )
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.DestroyListing));

// Route to render the "edit listing" form
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.renderEditform));

module.exports = router;
