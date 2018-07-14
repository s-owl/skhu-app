export default class BuildConfigs{
    static API_SERVER_ADDR = __DEV__ == true? 'http://localhost:3000' : '';
    static OPENWEATHERMAP_API_KEY = ''; // OpenWeatherMap API KEY
}