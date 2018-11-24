const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.SERVER_PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO: move this
const API = 'https://api.thewatcher.io/';
app.get('/api/game_asset/:asset', (req, res) =>
{
    axios
        .get(API + 'game_asset/' + req.params.asset)
        .then((response) =>
        {
            let returnArray = [];
            for (let item in response.data)
            {
                if(response.data.hasOwnProperty(item))
                {
                    let card = response.data[item];
                    card.key = item;
                    returnArray.push( card );
                }
            }
            res.send(returnArray);
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));