const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.SERVER_PORT || process.env.PORT || 5002;

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

//Serve up built react app on production
if (process.env.NODE_ENV === 'production')
{
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}


app.listen(port, () => console.log(`Listening on port ${port}`));