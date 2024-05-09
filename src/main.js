import dotenv from "dotenv";
dotenv.config();
import express from "express";
import NodeGeocoder from "node-geocoder";
import googleMapsClient from "@google/maps";
import axios from "axios";
import connectDB from "./config/db.js";

const PORT = process.env.PORT;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// routes
import countryRoutes from "./routes/country.route.js";

googleMapsClient.createClient({
  key: apiKey,
});

const options = {
  provider: "google",
  apiKey: apiKey,
};

const geocoder = NodeGeocoder(options);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running...");
});

app.use("/country", countryRoutes);

app.get("/geneva", (req, res) => {
  geocoder.geocode("Geneva, Suez, Egypt", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(data);
  });
});

app.get("/restaurant", async (req, res) => {
  try {
    const city = "ismailia";
    const category = "restaurant";
    const nearTo = "sultanhussin";

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${nearTo}+${category}+${city}&type=${category}&key=${apiKey}`
    );

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
