const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.SERVER_PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO: move this
const API = 'https://api.thewatcher.io/';
app.get('/api/cards/:card_type', (req, res) =>
{
    axios
        .get(API + 'game_asset/' + req.params.card_type)
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
            return res.send(returnArray);
        });
});

app.get('/api/expansions', (req, res) =>
{
    axios
        .get(API + 'game_asset/expansion')
        .then((response) =>
        {
            let returnArray = [];
            for (let item in response.data)
            {
                if(response.data.hasOwnProperty(item))
                {
                    let expansion = response.data[item];
                    expansion.key = item;
                    expansion.title = expansion.name;
                    expansion.decks_needed =
                    [
                        {
                            title: expansion.name + ' Resources',
                            sub_type: expansion.handle + '_resources',
                            handle: expansion.handle + '_resources',
                            type: 'resources'
                        }
                    ];
                    returnArray.push( expansion );
                }
            }

            //Add core in
            returnArray.push(
            {
                title: 'Core',
                handle: 'core',
                key: 'core',
                decks_needed:
                [
                    {
                        title: 'White Lion Resources',
                        sub_type: 'white_lion_resources',
                        handle: 'white_lion_resources',
                        type: 'resources'
                    },
                    {
                        title: 'Screaming Antelope Resources',
                        sub_type: 'screaming_antelope_resources',
                        handle: 'screaming_antelope_resources',
                        type: 'resources'
                    },
                    {
                        title: 'Phoenix Resources',
                        sub_type: 'phoenix_resources',
                        handle: 'phoenix_resources',
                        type: 'resources'
                    }
                ]
            });

            return res.send(returnArray);
        });
});

app.get('/api/expansions/:expansion', (req, res) =>
{
    axios
        .get(API + 'game_asset/expansion')
        .then((response) =>
        {
            for (let item in response.data)
            {
                if(response.data.hasOwnProperty(item) && req.params.expansion === item)
                {
                    let card = response.data[item];
                    card.key = item;
                    return res.send(card);
                }
            }
            return res.status(404).send('Expansion with given key not found.');
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));