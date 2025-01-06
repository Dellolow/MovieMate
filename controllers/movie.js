const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const ensureSignedIn = require("../middleware/ensure-signed-in");

// GET /movies (Show all movies for a signed-in user)
router.get("/", ensureSignedIn, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user._id });
    res.render("movies/index.ejs", { title: "Your Movies", movies });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// GET /movies/new (Render form to add a new movie)
router.get("/new", ensureSignedIn, (req, res) => {
  res.render("movies/new.ejs", { title: "Add New Movie" });
});

// POST /movies (Add a new movie to the database)
router.post("/", ensureSignedIn, async (req, res) => {
  try {
    const newMovie = { ...req.body, user: req.user._id };
    await Movie.create(newMovie);
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.redirect("/movies");
  }
});

// DELETE /movies/:id (Remove a movie)
router.delete("/:id", ensureSignedIn, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect("/movies");
  } catch (err) {
    console.error(err);
    res.redirect("/movies");
  }
});

module.exports = router;
