const Listing = require("../models/listing.js");
const fetch = require('node-fetch');




module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("Listing/index.ejs", { allListings });
};

module.exports.renderNewform = (req, res) => {
    res.render("Listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/Listings");
        }
        res.render("Listing/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        req.flash("error", "Unable to fetch listing details");
        res.redirect("/Listings");
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        const { listing } = req.body;
        if (!req.file) {
            req.flash("error", "File upload is required");
            return res.redirect("/Listings/new");
        }

        // Log the location being searched
        console.log("Location being searched:", listing.location);

        // Fetch location coordinates using OpenCage Geocoding API
        const location = listing.location;
        const apiKey = "7e9d2709356a488198093e474522a9a2"; // Replace with your OpenCage API key

        const geocodeResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
        
        if (!geocodeResponse.ok) {
            throw new Error("Failed to fetch geocoding data");
        }
        
        const geocodeData = await geocodeResponse.json();

        // Log the geocode response for debugging
        console.log("Geocode API response:", geocodeData);

        if (geocodeData.results.length === 0) {
            req.flash("error", "Location not found");
            return res.redirect("/Listings/new");
        }

        const { lat, lng } = geocodeData.results[0].geometry;

        // Log the fetched coordinates
        console.log("Fetched coordinates:", lat, lng);

        // Check if the coordinates are valid
        if (isNaN(lat) || isNaN(lng)) {
            req.flash("error", "Invalid coordinates received. Please check the location.");
            return res.redirect("/Listings/new");
        }

        const newListing = new Listing({
            ...listing,
            geometry: { type: "Point", coordinates: [lng, lat] },
            owner: req.user._id,
            image: { url: req.file.path, filename: req.file.filename },
        });

        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/Listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        next(err);
    }
};

module.exports.renderEditform = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/Listings");
        }
        res.render("Listing/edit.ejs", { listing });
    } catch (err) {
        console.error("Error rendering edit form:", err);
        req.flash("error", "Unable to load edit form");
        res.redirect("/Listings");
    }
};

module.exports.UpdateListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch existing listing
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/Listings");
        }

        const { title, description, price, location } = req.body.listing;

        // Update text fields
        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = price || listing.price;

        // If the location is updated, fetch new coordinates
        if (location && location !== listing.location) {
            const apiKey = "7e9d2709356a488198093e474522a9a2"; // Replace with your OpenCage API key
            console.log("Location being searched for update:", location); // Log the updated location

            const geocodeResponse = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`
            );

            if (!geocodeResponse.ok) {
                throw new Error("Failed to fetch geocoding data");
            }

            const geocodeData = await geocodeResponse.json();
            console.log("Geocode API response for update:", geocodeData);

            if (geocodeData.results.length > 0) {
                const { lat, lng } = geocodeData.results[0].geometry;

                // Log the fetched coordinates
                console.log("Updated coordinates:", lat, lng);

                // Check if the coordinates are valid
                if (isNaN(lat) || isNaN(lng)) {
                    req.flash("error", "Invalid coordinates received. Please check the location.");
                    return res.redirect(`/Listings/${id}/edit`);
                }

                listing.geometry = {
                    type: "Point",
                    coordinates: [lng, lat], // [longitude, latitude]
                };
                listing.location = location; // Update the location
            } else {
                req.flash("error", "Unable to fetch location coordinates. Please try again.");
                return res.redirect(`/Listings/${id}/edit`);
            }
        }

        // Update image if a new file is uploaded
        if (req.file) {
            listing.image.url = req.file.path;
            listing.image.filename = req.file.filename;
        }

        // Save updated listing
        await listing.save();
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/Listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("error", "Unable to update listing. Please try again.");
        res.redirect("/Listings");
    }
};

module.exports.DestroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/Listings");
        }
        req.flash("success", "Listing deleted successfully");
        res.redirect("/Listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Unable to delete listing");
        res.redirect("/Listings");
    }
};
