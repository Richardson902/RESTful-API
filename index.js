// Import required modules
const Joi = require("joi"); // For input validation
const express = require("express"); // For creating RESTful APIs
const app = express(); // Initialize Express application

// Middleware to parse JSON data
app.use(express.json());

// Sample data for movies
const movies = [
  { id: 1, name: "Space Balls" },
  { id: 2, name: "Scary Movie" },
  { id: 3, name: "Interstellar" },
];

// Route to handle root endpoint
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to get all movies
app.get("/api/movies", (req, res) => {
  res.send(movies);
});

// Route to add a new movie
app.post("/api/movies", (req, res) => {
  // Validate the request body
  const { error } = validatemovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create a new movie object
  const movie = {
    id: movies.length + 1,
    name: req.body.name,
  };
  movies.push(movie);
  res.send(movie);
});

// Route to update a movie
app.put("/api/movies/:id", (req, res) => {
  // Find the movie by ID
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  // Validate the request body
  const { error } = validatemovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update the movie name
  movie.name = req.body.name;
  res.send(movie);
});

// Route to delete a movie
app.delete("/api/movies/:id", (req, res) => {
  // Find the movie by ID
  const movieIndex = movies.findIndex((c) => c.id === parseInt(req.params.id));
  if (movieIndex === -1)
    return res.status(404).send("The movie with the given ID was not found.");

  // Remove the movie from the array
  const deletedMovie = movies.splice(movieIndex, 1)[0];

  // Update the IDs of the remaining movies
  movies.forEach((movie, index) => {
    movie.id = index + 1;
  });

  res.send(deletedMovie);
});

// Route to get a single movie by ID
app.get("/api/movies/:id", (req, res) => {
  // Find the movie by ID
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(movie);
});

// Function to validate movie data
function validatemovie(movie) {
  const schema = {
    name: Joi.string().min(3).required(), // Name must be a string with minimum length of 3 characters
  };

  return Joi.validate(movie, schema);
}

// Set up the server to listen on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
