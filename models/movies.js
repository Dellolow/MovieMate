const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  director: { type: String },
  description: { type: String },
  watched: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 }, // Optional rating from 1 to 5
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
});

module.exports = mongoose.model("Movie", movieSchema);
