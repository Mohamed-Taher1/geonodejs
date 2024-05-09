import { Schema, model } from "mongoose";

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capital: {
      type: String,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    continent: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: [
          "Point",
          "LineString",
          "Polygon",
          "MultiPolygon",
          "MultiPoint",
          "MultiLineString",
        ],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true, index: { location: "2dsphere" } }
);

const Country = model("Country", countrySchema);

module.exports = Country;
