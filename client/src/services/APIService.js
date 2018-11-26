import axios from 'axios';

const API = '/api/';


export default class APIService
{
    //Gets Cards, turns into array - Returns
    static getCards(cardType, forceClearCache = false)
    {
        const cache = JSON.parse(localStorage.getItem(API + 'cards/' + cardType));
        const cacheTime = localStorage.getItem(API + 'cards/' + cardType + '_time');
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
            .get(API + 'cards/' + cardType)
            .then((response) =>
            {
                //console.log(response);
                //Cache data
                localStorage.setItem(API + 'cards/' + cardType, JSON.stringify(response.data));
                localStorage.setItem(API + 'cards/' + cardType + '_time', curTime.toString());
                return response.data;
            });
    }

    static getExpansions(forceClearCache = false)
    {
        const cache = JSON.parse(localStorage.getItem(API + 'expansions'));
        const cacheTime = localStorage.getItem(API + 'expansions_time');
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
            .get(API + 'expansions')
            .then((response) =>
            {
                //console.log(response);
                //Cache data
                localStorage.setItem(API + 'expansions', JSON.stringify(response.data));
                localStorage.setItem(API + 'expansions_time', curTime.toString());
                return response.data;
            });
    }
}