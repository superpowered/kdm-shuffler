const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.SERVER_PORT || 5002;

//Routes
const cards = require('./routes/cards');
const expansions = require('./routes/expansions');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO: cache middleware

//Cards
app.use('/api/cards', cards);
//Expansions
app.use('/api/expansions', expansions);


if (process.env.NODE_ENV === 'production')
{
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}


app.listen(port, () => console.log(`Listening on port ${port}`));