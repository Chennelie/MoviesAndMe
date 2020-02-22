const API_TOKEN = "657cb157a7fd6debbacfbe852148213d";

//Get a movie list by a keyword
export function getFilmsFromApiWithSearchedText (text, page) {
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + "&page=" + page
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

//Get a movie image
export function getImageFromApi (name) {
  return 'https://image.tmdb.org/t/p/w300' + name
}

//Get a movie details
export function getFilmDetailFromApi (id) {
  return fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_TOKEN + '&language=fr')
    .then((response) => response.json())
    .catch((error) => console.error(error));
}