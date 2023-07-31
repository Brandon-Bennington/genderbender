// app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user');
const genreBendRoutes = require('./routes/genre-bend');

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', genreBendRoutes);

module.exports = app; // This is for testing








/*require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const path = require('path');
const User = require('./models/User'); // adjust the path as needed
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(cors());
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());

app.get('/api/genre-bend/:title/:genre', async (req, res) => {
  try {
    const title = req.params.title;
    const genre = req.params.genre;
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}`);
    const movie = tmdbResponse.data.results[0];

    if (!movie) {
      res.status(404).send('Movie not found');
      return;
    }

    const movieSummary = movie.overview;
    let genreSpecificPrompt = "";
    switch (genre) {
      case 'action':
        genreSpecificPrompt = ` Envision a heart-stopping third act with a nail-biting stunt sequence and introduce the villain who'll go head to head with our protagonist.`;
        break;
      case 'comedy':
        genreSpecificPrompt = ` Suggest a hilarious scenario or a running gag that will have the audience in stitches throughout the film.`;
        break;
      case 'drama':
        genreSpecificPrompt = ` What emotional hurdles will our characters face? Paint a scene from the climax that could leave the audience in awe.`;
        break;
      case 'family':
        genreSpecificPrompt = ` Sketch an unforgettable character or a fantastic scenario that children will love. If it's animated or CGI, who would be the ideal voices behind the characters?`;
        break;
      case 'fantasy':
        genreSpecificPrompt = ` Transport us to a magical world, describe its unique traits and the mystical creatures inhabiting it.`;
        break;
      case 'horror':
        genreSpecificPrompt = ` Distill the fear factor. What kind of horror will it be and what terrifying threat will our characters face?`;
        break;
      case 'sci-fi':
        genreSpecificPrompt = ` Describe an awe-inspiring futuristic setting and a plot element that will leave the audience mesmerized.`;
        break;
      case 'thriller':
        genreSpecificPrompt = ` What will keep the audience on the edge of their seats? Illustrate a sequence that they will not be able to resist watching in a theatre.`;
        break;
      default:
        genreSpecificPrompt = ` Add a twist or a detail that makes this film unique within its genre.`;
    }

    const prompt = `Imagine a ${genre} film remake of "${title}" based on this summary: "${movieSummary}". Your pitch should include:
    - Main Characters: Give a brief introduction of our two dream leads.
    - Director: Who is the dream director to bring this vision to life?
    - Story Arc: Share a glimpse of the beginning, middle and end.
    - Climax: Describe the peak of the story.
    - Setting: Where does this story unfold?
    - Tagline: Craft a catchy phrase that captures the film's spirit.${genreSpecificPrompt}`;

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 300,
        n: 1,
        stop: null,
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const genreBentVersion = openaiResponse.data.choices[0].text.trim();
    res.send(genreBentVersion);
  } catch (error) {
    console.error(error);
    if(error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of http.ClientRequest in node.js
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
    console.error('Error', error.message);
    console.error(error.config);
    res.status(500).send('An error occurred while processing your request: ' + error.message);
  }
});

app.post('/signup', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secretKey, { expiresIn: '5 days' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
]);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, secretKey, { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(3000, () => console.log(`Server running on port 3000`));
*/