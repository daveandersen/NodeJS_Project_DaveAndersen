const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})


const users = [
    { id: 1, username: 'Dave Andersen', email: 'daveytheboo@gmail.com', password: 'HAHAHA' }
];

const movies = [
    {id: 1, title: 'True Blood', rate: 'PG-13', length: 203, r_date: '2 October, 2017', director: 'James Wan'}

];


app.get('/api/users', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log('User data has been retrieved.');
    return res.json(users);

});

// LOGIN
app.get('/api/users/:email/:password', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new GET HTTP request for LOGIN");
    console.log(req.body);

    // VALIDATE
    const {error} = validateLogin(req.params);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');


    //console.log('Check existing email: '+req.params.email+' and password: '+req.params.password);
    //const check_user = users.find( u => u.email === req.params.email && u.password === req.params.email );
    const check_user = users.find( u => u.email === req.params.email && u.password === req.params.password);
    if (!check_user) {
        var error_message = 'Invalid login detail. Username or password is not correct.';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }
        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.params.email + ' sucessfully login.\n');
    var jsonRespond = {
        result: user,
        message: "Login success"
    }
    return res.json(jsonRespond);



});

// Register
app.post('/api/users', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new POST HTTP request");
    console.log(req.body);

    const {error} = validateRegister(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');

    console.log('Check existing email: '+req.body.email);
    const check_user = users.find( u => u.email === req.body.email );
    if (check_user) {
        console.log('Email: '+req.body.email+' is already registered');

        var jsonRespond = {
            result: "",
            message: "Registration failed. Email "+req.body.email+" is already registered. Please use other email."
        }

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.body.email + ' is available for registration');
    const user = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    users.push(user);
    return res.json(user);
});

//Delete User
app.delete('/api/users/:id', (req, res) => {
    const user = users.find( u => u.id === parseInt(req.params.id) );
    if (!user) return res.status(404).send('ID not found.');

    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.json(user);
});


// Movies.html
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
    return res.json(movie);
});

app.delete('/api/movies/:id', (req, res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');

    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    return res.json(movie);
});




// Movie-profile.html
app.get("/api/movie-profile", (req, res) => {
    return res.json(movies);
});

app.get('/api/movie-profile/:id', (req, res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');
    return res.json(movie);
})

app.post('/api/movie-profile', (req, res) => {
    const {error} = validateMovieProfile(req.body);
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

app.put('/api/movie-profile/:id', (req, res) => {
    const {error} = validateMovieProfile(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');

    movie.title = req.body.title;
    movie.rate = req.body.rate;
    movie.length = req.body.length + ' minutes';
    movie.r_date = req.body.r_date;
    movie.director = req.body.director;

    return res.json(movie);
});

app.delete('/api/movie-profile/:id', (req, res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id) );
    if (!movie) return res.status(404).send('ID not found.');

    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    return res.json(movie);
});




// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

//FUNCTION


function validateLogin(user){
    const schema = Joi.object({
        email:  Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        //username: Joi.string().min(3).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })

    return schema.validate(user);
}

function validateRegister(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
    });

    return schema.validate(movie);
}

function validateMovieProfile(movie) {
    const schema = Joi.object({
        title: Joi.string().required(),
        rate: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NC-17'),
        length: Joi.number().integer().min(2).required(),
        r_date: Joi.date().required(),
        director: Joi.string().min(3).required()
    });

    return schema.validate(movie);
}
