import axios from 'axios';

const API = 'https://api.thewatcher.io/';


export default class APIService
{
    //Gets Cards, turns into array - Returns
    static getCards(cardType)
    {
        //TODO: check our local storage first

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
                return returnArray;
            });
    }
}