var app = {};
app.fullDivs = []; // this keeps track of gridbox ids that are currently displaying content

app.Pokeball = function(data) {
  var key = Object.keys(data.pokemons)[0]; // chooses first pokemon mentioned in text for display image
  var imageSrc = data.pokemons[key];

  this.id = m.prop(data.id);
  this.text = m.prop(data.message);
  this.imageSrc = m.prop(imageSrc);
  this.color = m.prop(randomColorGenerator());
}

app.vm = (function() { 
  var vm = {};
  vm.init = function() {
    vm.activeList = {};

    // updates hash of tweets used to render new view, creates empty space in grid if it is too full
    vm.add = function(data) {
      fullPokemonGridsBoxes.push(data.id); // keeps track of tweet id to prevent tweet duplication
      if (app.emptyDivs.length < 3) {
        emptyDiv(); // if there are less than 3 open divs, then app starts to remove pokeballs, consider adjusting open spaces to size of grid
      }
      app.vm.activeList[getEmptyDiv()] = new app.Pokeball(data); // adds tweet information to hash
      m.redraw() // forces redrawing of the view
    };
    // removes tweet information used to redraw view, and moves divId from fullDiv array to emptyDiv array
    function emptyDiv() {
      firstEl = app.fullDivs.shift() // finds tweet that has been displayed the longest...
      app.emptyDivs.push(firstEl) // ...and updates empty divs array
      
      el = app.vm.activeList[firstEl]
      elIndex = fullPokemonGridsBoxes.indexOf(el.id())
      fullPokemonGridsBoxes.splice(elIndex, 1);
      delete app.vm.activeList[firstEl]
    }
    // chooses a random empty div to populate with newest tweet
    function getEmptyDiv() {
      var randomDiv = app.emptyDivs[ randomNum(app.emptyDivs.length) ]
      var randomDivIndex = app.emptyDivs.indexOf(randomDiv)
      app.fullDivs.push(app.emptyDivs.splice(randomDivIndex, 1)[0])      

      return randomDiv
    }
  }
  return vm
}())