import axios from 'axios';

const API = 'https://api.thewatcher.io/';


export default class APIService
{
    //Gets Cards, turns into array - Returns
    static getCards(cardType, forceClearCache = false)
    {
        const cache = JSON.parse(localStorage.getItem(API + 'game_asset/' + cardType));
        const cacheTime = localStorage.getItem(API + 'game_asset/' + cardType + '_time');
        const curTime = Math.round((new Date()).getTime() / 1000);

        if(cache && cache.length && !forceClearCache && cacheTime && curTime - parseInt(cacheTime) < 86400) //1 day
        {
            //console.log('Cache Used! ' + cardType, curTime - parseInt(cacheTime));
            return new Promise((resolve) =>
            {
                resolve(cache);
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
                localStorage.setItem(API + 'game_asset/' + cardType + '_time', curTime.toString());
                return returnArray;
            });
    }
}