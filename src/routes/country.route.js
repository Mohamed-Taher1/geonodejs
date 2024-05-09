import express from "express";
import Country from "../models/country.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, capital, population, continent, location } = req.body;

  // Validation
  if (!name || !capital || !population || !continent || !location) {
    return res
      .status(400)
      .send("Invalid request: Please provide all required country data");
  }

  try {
    // Validate location data format (optional)
    if (
      !location.type ||
      !location.coordinates ||
      !Array.isArray(location.coordinates)
    ) {
      return res
        .status(400)
        .send("Invalid location data: Please provide a valid GeoJSON point");
    }

    // Create a new Country instance
    const newCountry = new Country({
      name,
      capital,
      population,
      continent,
      location,
    });

    // Save the new country to the database
    await newCountry.save();

    res.status(201).send("Country created successfully!"); // 201 Created status code
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", async (req, res) => {
  const { longitude, latitude, radius } = req.query; // Assuming optional query parameters

  try {
    // Optional query parameter validation (adjust as needed)
    if (
      !longitude ||
      !latitude ||
      !radius ||
      isNaN(longitude) ||
      isNaN(latitude) ||
      isNaN(radius)
    ) {
      return res
        .status(400)
        .send(
          "Invalid request: Please provide valid longitude, latitude, and radius as query parameters"
        );
    }

    // GeoJSON point for search center
    const searchPoint = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)], // Parse to numbers
    };

    // Build the query using $geoWithin with 2dsphere index
    const query = {
      location: {
        $geoWithin: {
          $centerSphere: [searchPoint.coordinates, radius / 6371], // Radius in kilometers, divided by Earth's radius
        },
      },
    };

    // Find countries within the specified radius
    const countries = await Country.find(query);

    if (countries.length === 0) {
      return res
        .status(204)
        .send("No countries found within the specified radius"); // 204 No Content
    }

    res.status(200).json(countries); // 200 OK with countries data
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
