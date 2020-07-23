const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

const movies = [
    {id: 1, title: 'True Blood', rate: 'PG-13', length: 203, r_date: '2 October, 2017', director: 'James Wan'}

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
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
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
        rate: req.body.rate,
        length: req.body.length + ' minutes',
        r_date: req.body.r_date,
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

    movie.title = req.body.title;
    movie.rate = req.body.rate;
    movie.length = req.body.length + ' minutes';
    movie.r_date = req.body.r_date;
    movie.director = req.body.director;

    return res.json(movie);
});

app.delete('/api/movies/:id', (req, res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
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
        title: Joi.string().required(),
        rate: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NC-17'),
        length: Joi.number().integer().min(2).required(),
        r_date: Joi.date().required(),
        director: Joi.string().min(3).required()
    });

    return schema.validate(movie);
}