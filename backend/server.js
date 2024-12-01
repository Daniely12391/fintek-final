// Import the required modules
const express = require("express"); // Import the Express framework
const app = express(); // Create an instance of the Express app
const PORT = 5000; // Define the port the server will run on
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Import fetch for making HTTP requests

// Define the Weather API key (keep this private in production)
const WEATHER_API_KEY = "1c2d28b2e6694a8db9c85252242811";

// Middleware to handle CORS (Cross-Origin Resource Sharing) issues
const cors = require("cors");
app.use(cors()); // Allow all origins for now (you can restrict this later)

// Define a route to get weather data
app.get("/api/weather", async (req, res) => {
    const city = req.query.city; // Extract the city from the query parameters

    // Validate if the city name was provided in the request
    if (!city) {
        return res.status(400).json({ error: "City name is required" }); // Return an error if the city is not provided
    }

    try {
        // Build the Weather API URL with the provided city and the API key
        const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;
        console.log(weatherApiUrl); // Log the URL for debugging purposes

        // Fetch weather data from the Weather API
        const response = await fetch(weatherApiUrl);
        const data = await response.json(); // Parse the JSON response

        // Check if the response is successful (status 200)
        if (response.ok) {
            res.json(data); // Send the weather data back to the frontend
        } else {
            res.status(404).json({ error: data.error.message }); // Send an error message if the city was not found
        }
    } catch (err) {
        console.error(err); // Log any errors that occur
        res.status(500).json({ error: "Server error" }); // Send a generic server error message
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server is running
});
