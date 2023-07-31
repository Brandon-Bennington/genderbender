// config.js

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  tmdbApiKey: process.env.TMDB_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET
};

