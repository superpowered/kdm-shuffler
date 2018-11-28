const express = require('express');
const router = express.Router();
const axios = require('axios');
const API = require('../API');

router.get('/', async (req, res) =>
{
    try
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
    }
    catch (err)
    {
        res.status(500).send('Error Getting Expansions');
    }
});

//TODO: /:expansion

module.exports = router;