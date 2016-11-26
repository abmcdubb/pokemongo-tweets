var source = new EventSource('/tweets');
var tweetManager = {};
var selectedPokemon = []
var fullPokemonGridsBoxes = []

tweetManager.activePokemon = {};

tweetManager.randomNum = function (length) {
  return Math.floor(Math.random() * length)
}

tweetManager.generateRange = function(maxNum) {
  return Array.apply(0, Array(maxNum))
    .map(function (element, index){
      return index + 1;
   })
}

tweetManager.randomColorGenerator = function () {
  colors = randomColor({count: 27, hue: "blue"});
  return colors[ tweetManager.randomNum(colors.length) ];
}

tweetManager.managePokeballs = function (element, isInitialized, context) {
  if (!isInitialized) return;

  parentDiv = element.parentElement
  elementKey = parseInt(parentDiv.id.replace('box', ''))
  pokemon = tweetManager.vm.activeList[elementKey]
  img = element.getElementsByTagName('img')[0];

  if (!parentDiv.classList.contains('empty') && typeof pokemon === 'undefined') {
    removePokeball()
  }
  if (parentDiv.classList.contains('empty') && typeof pokemon != 'undefined') {
    addPokeball() 
  }
  
  function addPokeball() {
    element.classList.add(pokemon.id()) //' animated bounceInLeft';
    parentDiv.classList.remove('empty')
    element.style.backgroundColor = pokemon.color();
    img.classList.add(pokemon.id());
    img.src = pokemon.imageSrc();
    addToLeaderBoard()
  }
  function removePokeball() {
    element.classList = 'pokeball';
    parentDiv.classList.add('empty');
    element.style.backgroundColor = 'transparent';
    img.classList = 'pokemon-image';
    img.src = '';
    removeFromLeaderBoard()
  }
  function addToLeaderBoard() {
    tweetStream = document.querySelector('#tweet-stream');
    paragraph = document.createElement('p');
    paragraph.className = 'tweet-text'  + ' ' + pokemon.id();
    newText = document.createTextNode(pokemon.text());
    paragraph.appendChild(newText);
    tweetStream.insertBefore(paragraph, tweetStream.firstChild);
  }
  function removeFromLeaderBoard() {
    leaderBoard = document.getElementById('tweet-stream');
    oldestTweet = leaderBoard.lastChild;
    leaderBoard.removeChild(oldestTweet);
  }
}

tweetManager.rowNum = 6;
tweetManager.columnNum = 6;
tweetManager.totalBoxes = tweetManager.rowNum * tweetManager.columnNum
tweetManager.randomColor = tweetManager.randomColorGenerator();


tweetManager.pokeBall = function(data) {
  var key = Object.keys(data.pokemons)[0];
  var imageSrc = data.pokemons[key];

  this.id = m.prop(data.id);
  this.text = m.prop(data.message);
  this.imageSrc = m.prop(imageSrc)
  this.color = m.prop(tweetManager.randomColorGenerator())
}

tweetManager.emptyDivs = tweetManager.generateRange(tweetManager.totalBoxes);
tweetManager.fullDivs = [];

tweetManager.vm = (function() { 
  var vm = {}
  vm.init = function() {
    vm.activeList = {}

    vm.add = function(data) {
      fullPokemonGridsBoxes.push(data.id)
      if (tweetManager.emptyDivs.length < 2) {
        emptyDiv()
      }
      tweetManager.vm.activeList[getEmptyDiv()] = new tweetManager.pokeBall(data); 
      m.redraw()
    };

    function emptyDiv() {
      firstEl = tweetManager.fullDivs.shift()
      tweetManager.emptyDivs.push(firstEl)

      el = tweetManager.vm.activeList[firstEl]
      elIndex = fullPokemonGridsBoxes.indexOf(el.id())
      fullPokemonGridsBoxes.splice(elIndex, 1);
      delete tweetManager.vm.activeList[firstEl]
    }

    function getEmptyDiv() {
      var randomDiv = tweetManager.emptyDivs[ tweetManager.randomNum(tweetManager.emptyDivs.length) ]
      var randomDivIndex = tweetManager.emptyDivs.indexOf(randomDiv)
      tweetManager.fullDivs.push(tweetManager.emptyDivs.splice(randomDivIndex, 1)[0])      

      return randomDiv
    }
  }
  return vm
}())


tweetManager.controller = function() {
  tweetManager.vm.init();
  m.redraw.strategy("all")
}

tweetManager.view = function() {
  var num = 1
  var rowArr = tweetManager.generateRange(tweetManager.rowNum)
  var columnArr = tweetManager.generateRange(tweetManager.columnNum)
  return [ m('#pokeballs', [
    [ rowArr.map(function(rNum) {
      return m('.row.row' + rNum, [
        columnArr.map(function(cNum) {
          return m('.gridbox.empty#box' + num++, [
            m('.pokeball', { config: tweetManager.managePokeballs }, [
              m('img.pokemon-image')
              ]
            )
          ]);
        })
      ]);
    })]
  ]),
  [ m('#sidebar', [
      m('#leaderboard-header', 'Tweet Stream'),
      m('#leaderboard', [
        m('#tweet-stream')
      ])
    ])]
  ]
};

document.addEventListener('DOMContentLoaded', function(event) {
  $('.choose-pokemon').selectize({maxItems: 40});
  $('.selectize-input').focusout(function() { getFormInput() });
  m.mount(document.getElementById('main'), {controller: tweetManager.controller, view: tweetManager.view});

  source.onmessage = function(event) {
    data = JSON.parse(event.data);
    if (fullPokemonGridsBoxes.indexOf(data.id) == -1 && pokemonShow(data)) {
      console.log(event.data);
      new tweetManager.vm.add(data);
    }
  };
});

function pokemonShow(tweet) {
  if (selectedPokemon.length == 0) {
    return true
  }
  else  {
    result = containsAny(Object.keys(tweet.pokemons))
    return result.length > 0
  }
}

function containsAny(tweetedPokemons) {
  var result = tweetedPokemons.filter(function(item){ return selectedPokemon.indexOf(item) > -1});   
  return result
}

function getFormInput() {
  inputItems = $('.item') //be more specific
  for(i = 0; i < inputItems.length ; i++) {
    selectedPokemon.push($(inputItems[i]).data('value'))
  }
  console.log(selectedPokemon)
}