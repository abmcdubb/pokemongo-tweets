app.view = function() {
  var num = 1
  var rowArr = generateRange(app.rowNum)
  var columnArr = generateRange(app.columnNum)

  return [ m('#pokeballs', [
    [ rowArr.map(function(rNum) {
      return m('.row.row' + rNum, [
        columnArr.map(function(cNum) {
          return m('.gridbox.empty#box' + num++, [
            m('.pokeball', { config: app.managePokeballs }, [
              m('img.pokemon-image')
              ]
            )
          ]);
        })
      ]);
    })]
  ]),
  [ m('#sidebar', { config: app.setHeightToLeaderBoard }, [
      m('#leaderboard-header', 'Tweet Stream'),
      m('#leaderboard', [
        m('#tweet-stream')
      ])
    ])]
  ]
};
// manages the html and classes that aid the adding and removing of pokeballs and tweet text in the view
app.managePokeballs = function (element, isInitialized, context) {
  if (!isInitialized) return;

  parentDiv = element.parentElement
  elementKey = parseInt(parentDiv.id.replace('box', ''))
  pokemon = app.vm.activeList[elementKey]
  img = element.getElementsByTagName('img')[0];

  if (!parentDiv.classList.contains('empty') && typeof pokemon === 'undefined') {
    removePokeball()
  }
  if (parentDiv.classList.contains('empty') && typeof pokemon != 'undefined') {
    addPokeball() 
  }
  
  function addPokeball() {
    element.classList.add(pokemon.id(), 'shown')
    parentDiv.classList.remove('empty')
    element.classList.remove('empty')
    element.style.backgroundColor = pokemon.color();
    img.classList.add(pokemon.id(), 'shown');
    img.src = pokemon.imageSrc();
    addToLeaderBoard()
  }
  function removePokeball() {
    element.classList = 'pokeball empty';
    parentDiv.classList.add('empty');
    img.classList = 'pokemon-image';
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
// generates size of leaderboard based on height of number of rows rendered
app.setHeightToLeaderBoard = function (element, isInitialized, context) {
  if (isInitialized) return;
  document.getElementById('leaderboard').style.height = Math.floor(window.innerHeight - navLength) + 'px';
}