const filmList = [
    'Frozen',
    'Daredevil (Bulls eye)',
    'I Am Mother',
    'Project Power',
    'Independence Day',
    'Indiana jones and the lost crusade',
    'Ip Man 4: The Finale',
    'Underwater',
    'Beowulf',
    'Below zero',
    'Spider-Man: Far from Home',
    'Tower Hiest',
    'Run All Night',
    'Dracula untold',
    'Double World',
    'Spider-Man: Into the spider-verse',
    'Battleship',
    'Baby Driver',
    'Shrek forever After',
    'Megamind',
    'Goosebumps',
    'San Adreas',
    'League of Gods',
    'Journey',
    'Juorney 2: The Mysterious Island',
    'Outside the Wire',
    'Wonder Woman 1984',
    'Tenet',
    'Jumanji: The Next Level',
    'How to Train Your Dragon 2'
]

const imageURL = "https://image.tmdb.org/t/p/w500/"
const wrapper = document.getElementById('root')
const form = document.querySelector('form')
const input = document.getElementById('search')

const key = 'c0b06d4e0a73ae098f28da02d1e58566'

let baseURL = 'https://api.themoviedb.org/3/movie/'

//Define the searchForMovie function that searches the database of
//themovie database, using the "search api". The response is a json containing
//all possible movies whose title contains the parameter of the function.
//Then call the loopThrough function. 
let searchForMovie = (value) => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${value}`
    fetch(url)
        .then(response => response.json())
        .then(json => {
            let search = json
            console.log(value + ' returned this ' +search)
            return loopThrough(search, value)
        })
        .catch(err => console.log(err.message))
}

//First loop through the array of film list to display them on the page
//once the page first load.
//By calling the searchForMovie function for each filmList element.
let initialize = () => filmList.forEach(movie => searchForMovie(movie))

//call the function to upload pictures to the page.
initialize()

//Define a function fetchMovieData that fetches and returns a json file
//for a particular movie.
let fetchMovieData = async (movie) => {
    let response = await fetch(movie)
    if(!response.ok) {
        throw new Error('There seems to be a very big problem with the query')
    }else {
        return await response.json()
    }
}

//Define the buildURL function the sets the url for a particular movie from the
//baseURL and the movie's id.
//Then call the fetchMovieData function using the movie's url as the parameter.
function buildURL(data) {
    let movieUrl = baseURL

    let movie_id = data['id']
    movieUrl += `${movie_id}?api_key=${key}`
    fetchMovieData(movieUrl)
        .then(json => {
            let info = json
            console.log(info)
            return displayMoviePoster(info)
        })
}

//Define the function that displays the movies on the page.
function displayMoviePoster(json) {
    let url = imageURL
    let posterPath = json.poster_path
    if(posterPath) {
        const cell = document.createElement('div')
        cell.setAttribute('class', 'cell')
        const article = document.createElement('article')
        article.className = 'hide'
        const link = document.createElement('a')
        link.setAttribute('href', json['homepage'])
        link.setAttribute('target', 'blank')
        const img = document.createElement('img')
        const card = document.createElement('div')
        img.setAttribute('src', `${url}/${posterPath}`)
        img.alt = json.title
        card.textContent = json.title.toUpperCase()
        card.className = 'card'
        const rating = document.createElement('p')
        rating.setAttribute('class', 'rating')
        rating.innerHTML = json.vote_average
        link.appendChild(img)
        cell.appendChild(link)
        cell.appendChild(card)
        cell.appendChild(rating)
        cell.appendChild(article)
        wrapper.appendChild(cell)
    
        card.addEventListener('click', () => overviewDisplay(json, cell, article), false)
    }
    return
}

//Define a function that displays and cancels the overview of a movie.
function overviewDisplay(json, cell, article) {
    article.textContent = json.overview + '\r\n' + 'Release date: ' + json['release_date']
    let attr = article.getAttribute('class')
    if(attr != 'show') {
        article.className = 'show'
    }else {
        article.className = 'hide'
    }
}

//Define the loopThrough function that loops through the result section of
//the json file returned in the searchForMovie() to find the one that matches
//exactly the movie title.
//If no exact match is found it returns the first movie in the file.
function loopThrough(s, val) {
    console.log(val)
    for(let i = 0; i < s['results'].length; i++) {
        if(val === s['results'][i]['original_title']) {
            return buildURL(s['results'][i])
        }
    }
    return buildURL(s['results'][0])
}

//I create an onsubmit listener event for the form element.
//Then call the validateInput function.
form.addEventListener('submit', function(e) {
    validateInput(e)
})

//When a user clicks the submit button the preventDefault() method is involked.
//Then a test is carried out to see if a value has been entered by the user.
//If test is false make a fuss. If true call the searchForMovie function with
//the input value as it's parameter.
function validateInput(e) {
    e.preventDefault()
    let test = /\w+/.test(input.value) || input.value.length
    let check = test ? 'valid' : 'invalid'
    input.className = check
    if(test) searchForMovie(input.value)
}

// hint: use a for loop to create the boxes and add information to them.

//level up:
//1. Are you able to add your own personal rating to each film card too?