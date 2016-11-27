var source = new EventSource('/tweets');
var filterByPokemon = []; // this stores pokemon selected by search form and filters stream results accordingly 
var fullPokemonGridsBoxes = []; // this keeps track of tweet ids that are currently being displayed

document.addEventListener('DOMContentLoaded', function(event) {
  $('.choose-pokemon').selectize({maxItems: 40});
  $('.selectize-input').focusout(function() { getFormInput() });

  setGridboxValues(); //sets values necessary to draw gridbox
  m.mount(document.getElementById('main'), {controller: app.controller, view: app.view});

  $('.gridbox').hover(function() {
    console.log(this.classList); //TODO: on hover display relevant tweet text in leaderboard
  })

  source.onmessage = function(event) {
    displayTweet(event);
  };
});
function randomNum(length) {
  return Math.floor(Math.random() * length);
}
function generateRange(maxNum) {
  return Array.apply(0, Array(maxNum))
    .map(function (element, index){
      return index + 1;
   })
}
function randomColorGenerator() {
  colors = randomColor({count: 27, hue: "blue"});
  return colors[ randomNum(colors.length) ];
}
function pokemonShow(tweet) {
  if (filterByPokemon.length == 0) {
    return true;
  }
  else  {
    result = containsAny(Object.keys(tweet.pokemons));
    return result.length > 0;
  }
}
function containsAny(tweetedPokemons) {
  var result = tweetedPokemons.filter(function(item){ return filterByPokemon.indexOf(item) > -1});   
  return result;
}
function getFormInput() {
  inputItems = $('.item')
  for(i = 0; i < inputItems.length ; i++) {
    filterByPokemon.push($(inputItems[i]).data('value'));
  }
  console.log(filterByPokemon); // TODO: remove one day
}
function setGridboxValues() {
  navLength = document.getElementById('nav').offsetHeight - 25; // Calculates the height of the nav bar and the border
  app.rowNum = Math.floor((window.innerHeight - navLength) / 120); // Calculates the amount of rows that can fit in a user's browser window
  app.columnNum = Math.floor(((document.body.offsetWidth - 100) * .70) / 120); // Calculates the amount of columns that can fit in the user's browser window

  app.totalBoxes = app.rowNum * app.columnNum; // Calculates the total amount of gridboxes for the page
  app.emptyDivs = generateRange(app.totalBoxes); 
  app.randomColor = randomColorGenerator(); // switch up colors 
}
function displayTweet() {
  data = ''
  try {
    data = JSON.parse(event.data);
  }
  catch (err) {
    console.log(event.data) // some of the messages can't be parsed due to unicode characters ex: "\u{1F6CD}"
  }   
  // this checks that a tweet with this id hasn't already been rendered and it filters by selected pokemon types
  if (fullPokemonGridsBoxes.indexOf(data.id) == -1 && pokemonShow(data)) {
    new app.vm.add(data);
  }
}