export default class BuildConfigs{
    static API_SERVER_ADDR = __DEV__ == true? 'http://localhost:3000' : 'https://skhusapp.sleepy-owl.com';
    static OPENWEATHERMAP_API_KEY = '8834d9ceca79cf8f705f892add715f7e'; // OpenWeatherMap API KEY
}