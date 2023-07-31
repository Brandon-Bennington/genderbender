// controllers/GenreBendController.js

const axios = require('axios');
const config = require('../config');

async function genreBend(req, res) {
    try {
        const title = req.params.title;
        const genre = req.params.genre;
    
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${config.tmdbApiKey}&query=${title}`);
        const movie = tmdbResponse.data.results[0];
       
        if (!movie) {
            return res.status(404).send('Movie not found');
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

        const prompt = `Pitch a ${genre} film remake of "${title}" based on this summary: "${movieSummary}": 
        #####
        The pitch must be 5-7 sentences max in this format:
        - Main Characters: List the dream leads of the film like this: "The two dream leads of the new film would {actor1} playing {mainCharacter1} and {actor2 playing {mainCharacter2}. If vital to the film can add one more actor in same format. 
        - Director: List dream director consider the genre (only 1 sentence).
        {Leave a line of space}
        - Story Arc: Share the exciting new vision of this film retold in the ${genre} spirit ${genreSpecificPrompt} .
        {Leave a line of space}
        - Climax & Setting: Where will the climax take place and tell us about why it will make this film a must see. 
        {Leave a line of space}
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
                    'Authorization': `Bearer ${config.openAiApiKey}`
                }
            }
        );

        const genreBentVersion = openaiResponse.data.choices[0].text.trim();
        res.send(genreBentVersion);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request: ' + error.message);
    }
}

module.exports = {
    genreBend
};


//${config.TMDB_API_KEY}
//'Authorization': `Bearer ${config.OPENAI_API_KEY}`