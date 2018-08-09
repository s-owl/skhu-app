export default class BuildConfigs{
    static API_SERVER_ADDR = __DEV__ == true? 'http://localhost:3000' : 'https://skhusapp.sleepy-owl.com/';
    static OPENWEATHERMAP_API_KEY = ''; // OpenWeatherMap API KEY
}