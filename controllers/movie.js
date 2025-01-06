const express = require("express");
const router = express.Router();
const ensureSignedIn = require("../middleware/ensure-signed-in");
const Movie = require("../models/movie");

// GET /movies (Index: Show all movies for the logged-in user)
router.get("/", ensureSignedIn, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user._id });
    res.render("movies/index.ejs", { title: "My Movies", movies });
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
});

// GET /movies/new (Show form to add a new movie)
router.get("/new", ensureSignedIn, (req, res) => {
  res.render("movies/new.ejs", { title: "Add Movie" });
});

// POST /movies (Create a new movie)
router.post("/", ensureSignedIn, async (req, res) => {
  try {
    req.body.user = req.user._id; // Associate the movie with the logged-in user
    await Movie.create(req.body);
    res.redirect("/movies");
  } catch (e) {
    console.error(e);
    res.redirect("/movies/new");
  }
});

// GET /movies/:id/edit (Show form to edit a movie)
router.get("/:id/edit", ensureSignedIn, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.user.toString() !== req.user._id.toString()) {
      return res.redirect("/movies");
    }
    res.render("movies/edit.ejs", { title: "Edit Movie", movie });
  } catch (e) {
    console.error(e);
    res.redirect("/movies");
  }
});

// PUT /movies/:id (Update movie details)
router.put("/:id", ensureSignedIn, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.user.toString() !== req.user._id.toString()) {
      return res.redirect("/movies");
    }
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/movies");
  } catch (e) {
    console.error(e);
    res.redirect("/movies");
  }
});

// DELETE /movies/:id (Delete a movie)
router.delete("/:id", ensureSignedIn, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.user.toString() !== req.user._id.toString()) {
      return res.redirect("/movies");
    }
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect("/movies");
  } catch (e) {
    console.error(e);
    res.redirect("/movies");
  }
});

module.exports = router;
