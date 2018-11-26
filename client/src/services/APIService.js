import axios from 'axios';

const API = '/api/';


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
                //console.log(response);
                //Cache data
                localStorage.setItem(API + 'game_asset/' + cardType, JSON.stringify(response.data));
                localStorage.setItem(API + 'game_asset/' + cardType + '_time', curTime.toString());
                return response.data;
            });
    }

    static getExpansions(forceClearCache = false)
    {
        const cache = JSON.parse(localStorage.getItem(API + 'game_asset/expansion'));
        const cacheTime = localStorage.getItem(API + 'game_asset/expansion_time');
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
            .get(API + 'game_asset/expansion')
            .then((response) =>
            {
                //console.log(response);
                //Cache data
                localStorage.setItem(API + 'game_asset/expansion', JSON.stringify(response.data));
                localStorage.setItem(API + 'game_asset/expansion_time', curTime.toString());
                return response.data;
            });
    }
}