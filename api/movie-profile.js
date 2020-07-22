const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

const movies = [
    {id: 1, title: 'True Blood', length: '203min', director: 'James Wan'}

]

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome!');
})

app.get("/api/movies", (req, res) => {
    return res.json(movies);
});

app.get('/api/movies/:id', (req, res) => {
    const movie = movies.find( c => c.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');
    return res.json(movie);
})

app.post('/api/movies', (req, res) => {
    const {error} = validateMovie(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const movie = {
        id: movies.length + 1,
        title: req.body.title,
        length: req.body.length,
        director: req.body.director
    };
    movies.push(movie);
    return res.json(movie);
});

app.put('/api/movies/:id', (req, res) => {
    const {error} = validateMovie(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const movie = movies.find( c => c.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');

    movie.name = req.body.name;
    return res.json(movie);
});

app.delete('/api/movies/:id', (req, res) => {
    const movie = movies.find( c => c.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');

    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    return res.json(movie);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        length: Joi.string().required(),
        director: Joi.string().min(3).required()
    });

    return schema.validate(movie);
}