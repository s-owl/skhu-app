import ForestApi from './apis';

export default class FetchHelper {
  static async fetchMealsUrl() {
    console.log('fetching meals urls');
    let thisWeekUrl = '';

    const urls = await ForestApi.get('/life/meal/urls', false);
    if (urls.ok) {
      console.log('urls');
      const data = await urls.json();
      thisWeekUrl = await data.urls[0].url;
    }

    return thisWeekUrl;
  }

  static async fetchMealsData(thisWeekUrl) {
    console.log('fetching meals data');
    let thisWeekMeals = [];

    const meals = await ForestApi.post('/life/meal/data', JSON.stringify({'url': thisWeekUrl}), false);
    if (meals.ok) {
      console.log('meals');
      const data = await meals.json();
      thisWeekMeals = await data.data.map(item => item);
    }

    return thisWeekMeals;
  }
}