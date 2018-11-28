const express = require('express');
const router = express.Router();
const axios = require('axios');
const API = require('../API');

//TODO: / probably just list out the card types?

router.get('/:card_type', async (req, res) =>
{
    try
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
            })
            .catch(() =>
            {
                res.status(500).send('Error Getting Cards');
            });
    }
    catch(err)
    {
        res.status(500).send('Error Getting Cards');
    }
});

module.exports = router;