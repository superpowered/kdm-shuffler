import axios from 'axios';

const API = 'https://api.thewatcher.io/';


export default class APIService
{
    //Gets Cards, turns into array - Returns
    static getCards(cardType)
    {
        //TODO: set timeout on cache
        const cache = JSON.parse(localStorage.getItem(API + 'game_asset/' + cardType));
        if(cache && cache.length)
        {
            return new Promise((resolve) =>
            {
                resolve(cache)
            })
        }

        return axios
            .get(API + 'game_asset/' + cardType)
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

                //Cache data
                localStorage.setItem(API + 'game_asset/' + cardType, JSON.stringify(returnArray));
                return returnArray;
            });
    }
}