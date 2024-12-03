document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");

    if (!mapElement) {
        console.error("Map element not found.");
        return;
    }

    // Get the latitude and longitude from the data attributes
    const latitude = parseFloat(mapElement.dataset.lat);
    const longitude = parseFloat(mapElement.dataset.lng);

    // Log the coordinates to verify they are being passed correctly
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    // Default to Los Angeles if coordinates are missing
    const defaultLocation = { lat: 34.0522, lng: -118.2437 };

    // Validate the latitude and longitude
    const isLatValid = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
    const isLngValid = !isNaN(longitude) && longitude >= -180 && longitude <= 180;

    // Use valid coordinates, or default if invalid
    const finalLat = isLatValid ? latitude : defaultLocation.lat;
    const finalLng = isLngValid ? longitude : defaultLocation.lng;

    console.log("Using coordinates:", finalLat, finalLng); // Log the final coordinates

    // Initialize the map centered on the valid coordinates with a custom zoom level
    const map = L.map("map").setView([finalLat, finalLng], 12); // Adjust zoom level here

    console.log("Map object:", map);  // Log the map object for debugging

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker at the coordinates with a popup displaying the title and location
    L.marker([finalLat, finalLng])
        .addTo(map)
        .bindPopup(`<b>${mapElement.dataset.title || "Unknown Title"}</b><br>${mapElement.dataset.location || "Unknown Location"}`)
        .openPopup();

    // Force recalculation of map size to avoid issues with rendering
    map.invalidateSize();
});
