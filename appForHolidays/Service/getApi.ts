const API_TOKEN = "5cb1d622d826606988d44a75b267abc2";

export function getWeatherFromApi(ville: string) {
  const url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    ville +
    ",fr&appid=" +
    API_TOKEN;
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error(error));
}
