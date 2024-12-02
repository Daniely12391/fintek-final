const express = require("express");
const app = express();
const PORT = 5000;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const WEATHER_API_KEY = "1c2d28b2e6694a8db9c85252242811";

const cors = require("cors");
app.use(cors());

app.get("/api/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City name is required" });
    }

    try {
        const results = [];
        const now = new Date();

        // Round current time to the nearest hour in UTC (to handle time zone discrepancies)
        now.setUTCMinutes(0, 0, 0);

        // Generate 5 hours: 2 hours back, current hour, and 2 hours ahead
        const hours = [
            new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours back
            new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour back
            new Date(now), // Current hour
            new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour ahead
            new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours ahead
        ];

        // Loop through each hour and fetch data
        for (const hour of hours) {
            const formattedHour = hour.getUTCHours().toString().padStart(2, '0'); // Format the hour in UTC

            console.log(`Fetching weather for hour: ${formattedHour}`);
            
            const weatherApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&hour=${formattedHour}`;
            console.log(`URL for weather data: ${weatherApiUrl}`);

            const response = await fetch(weatherApiUrl);
            const data = await response.json();

            if (response.ok) {
                console.log(`Weather data for ${formattedHour}:`, data);
                results.push({ hour: formattedHour, data });
            } else {
                console.log(`Error fetching data for hour ${formattedHour}:`, data.error.message);
                results.push({ hour: formattedHour, error: data.error.message });
            }
        }

        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
