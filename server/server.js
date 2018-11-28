const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(port, () => console.log(`Listening on port ${port}`));