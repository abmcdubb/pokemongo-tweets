var source = new EventSource('/tweets');
var fullPokemonGridsBoxes = []
// var totalGridBoxes = 0

document.addEventListener("DOMContentLoaded", function(event) {
  createGrid()

  $('.choose-pokemon').selectize({maxItems: null})

  source.onmessage = function(event) {
    console.log(event.data);
    data = JSON.parse(event.data);

    showPokemon(data)
  };

})

function createGrid() {
  var pokeballsContainer = document.querySelector('#pokeballs')

  width = pokeballsContainer.offsetWidth;
  // height = window.innerHeight;

  columns = Math.floor(width / 100);
  // rows = Math.floor(height / 150);
  rows = 1

  for (var r = 0; r < rows; r++ ) {
    parentDiv = document.createElement('div');
    parentDiv.className = 'row'
    parentDiv.className += " row" + r 

    for (var c = 0; c < columns; c++) {
      childDiv = document.createElement('div');
      childDiv.className = "column" + c
      childDiv.className += ' gridbox'
      childDiv.className += ' empty'

      parentDiv.appendChild(childDiv);
    };

    
    pokeballsContainer.appendChild(parentDiv, pokeballsContainer);
  }
  // set leaderboard height
  leaderboard = document.querySelector('#leaderboard')
  leaderboard.style.height = pokeballsContainer.offsetHeight + "px"

  // story total number of pokemon grid boxes
  totalGridBoxes = rows * columns
}

function showPokemon(tweet) {
  emptyGrids = document.getElementsByClassName('gridbox empty');

  if (emptyGrids.length > 0) {
    var randomColor = randomColorGenerator();
    var pokeball = createPokeball(tweet, randomColor);
    var image = getImage(tweet);
    var randomGrid = emptyGrids[ Math.floor(Math.random() * emptyGrids.length) ];

    randomGrid.appendChild(pokeball, randomGrid);
    pokeball.appendChild(image, pokeball);

    randomGrid.classList.remove("empty");

    addToLeaderboard(tweet, randomColor);

    if (emptyGrids.length <= 2) {
      removePokemon()
    }
  }
}

function removePokemon() {
  classToRemove = fullPokemonGridsBoxes.shift();
  
  var pokeballToRemove = document.querySelector("." + classToRemove + '.pokeball');
  var imageToRemove = document.querySelector("." + classToRemove + '.pokemon-image');
  var tweetToRemove = document.querySelector("." + classToRemove + '.tweet-text');

  // pokeballToRemove.classList.remove('bounceInLeft')
  // pokeballToRemove.classList.add('fadeOutDownBig')

  // pokeballToRemove.addEventListener("webkitTransitionEnd", function()
  //   { 
  //     debugger
      tweetToRemove.parentNode.removeChild(tweetToRemove)
      imageToRemove.parentNode.removeChild(imageToRemove)
      pokeballToRemove.parentNode.classList.add('empty')
      pokeballToRemove.parentNode.removeChild(pokeballToRemove)
  //   }
  // ); 
}

function addToLeaderboard (tweet, color) {
  tweetStream = document.querySelector('#tweet-stream')

  paragraph = document.createElement('p');
  paragraph.className = 'tweet-text'  + ' ' + tweet.id
  newText = document.createTextNode(tweet.message);
  paragraph.appendChild(newText);

  tweetStream.insertBefore(paragraph, tweetStream.firstChild);
}

function randomColorGenerator() {
  colors = randomColor({count: 27, hue: "blue"});
  return colors[ Math.floor(Math.random() * colors.length) ];
}

function createPokeball(tweet, color) {
  div = document.createElement('div');
  div.className = 'pokeball' + ' ' + tweet.id + ' animated bounceInLeft';
  div.style.backgroundColor = color;

  fullPokemonGridsBoxes.push(tweet.id)

  return div
}

function getImage(tweet) {
  var firstKey = Object.keys(tweet.pokemons);
  var imageSrc = tweet.pokemons[firstKey];

  image = document.createElement('img');
  image.className = 'pokemon-image' + ' ' + tweet.id;
  image.src = imageSrc;

  return image
}


