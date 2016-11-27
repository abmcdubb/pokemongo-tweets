### PokemonGo Tweets 
Monitors mentions on twitter of the original 150 Pokemon characters and displays those mentions. Uses the Twitter Streaming API and built with Sinatra, Mitrhil, and CSS.

*** TODO (In no particular order): ***

- [ ] Auto reconnect when stream loses connection.
- [ ] Add search parameters to URL when search filter is applied, so searches can be automatically applied by sharing link
- [ ] Clear screen of all non-filtered items when filter is applied
- [ ] Add smoother animations- especially in tweet stream display
- [ ] Randomize random color generator, select different hues
- [ ] Read more about mithril and update use of mithril code where better solutions are discovered
- [ ] Review JS code to make more readable, less redundant
- [ ] Add hover effect on pokeballs and related tweet text to highlight the connection between the two.
- [ ] Strip out code that prevents the parsing of JSON message i.e. \u{1F6CD}
- [ ] Create more responsive design
- [ ] Figure out a way to strip out R-rated tweets i.e. Jynx
- [ ] Consider: Do I want to do anything with geolocation information?
- [ ] Consider: Do I want to provide more information about tweets (user, hyperlinks?, etc.)?
- [ ] Research ways to filter tweets on the backend
- [ ] Consider changing out backend technology to something more aligned with streaming data (Node?)
- [ ] Add tool to concatenate js files into one
- [ ] Add loading indicator while waiting for tweets to come in
- [ ] Consider highlighting most recently displayed text in main view