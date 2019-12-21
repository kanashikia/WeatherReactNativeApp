import {REACT_APP_API_TOKEN} from "@env";

const API_TOKEN = REACT_APP_API_TOKEN;

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
