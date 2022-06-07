import axios from "axios";


// the functions are here incase I'll change api later...

const moviesApi = axios.create({
    baseURL: 'https://api.tvmaze.com/',
    timeout: 10000,
});

export function getMovieById (id){
    return moviesApi.get(`shows/${id}`)
}
export function searchMovies (quary){
    return moviesApi.get(`search/shows?q=${quary}`)
}
export function getFullMovieInfo(id){
    // this includes list of episodes and cast
    return moviesApi.get(`shows/${id}?embed[]=episodes&embed[]=cast`)
}
export function getMoviesPage(pageNumber){
    // pages between 0 to n?
    return moviesApi.get(`shows?page=${pageNumber}`)
}

