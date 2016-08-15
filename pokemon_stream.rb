require 'sinatra'
require 'yaml'
require 'haml'
require 'tweetstream'
require 'pry'

set :server, 'thin'
connections = []
tracked_terms = ['Pikachu', 'Bulbasaur']
all_pokemon = YAML.load_file('list_of_pokemon.yml')

twitter_config = YAML.load_file('config.yml')['twitter']

TweetStream.configure do |config|
  config.consumer_key       = twitter_config['consumer_key']
  config.consumer_secret    = twitter_config['consumer_secret']
  config.oauth_token        = twitter_config['oauth_token']
  config.oauth_token_secret = twitter_config['oauth_token_secret']
  config.auth_method        = :oauth
end

get '/' do
  haml :index
end

get '/tweets', provides: 'text/event-stream' do
  stream :keep_open do |out|
    connections << out
    out.callback { connections.delete(out) }
  end
end

def stream_message(tweet, terms)
  pokemons = matched_pokemons(tweet.text, terms)

  if pokemons.any?
    message = "data:{\"message\":#{tweet.text.inspect},\"user\":\"#{tweet.user.name}\""
    message += ",\"pokemons\":{"
    pokemons.each { |pokemon| message += pokemon_info(pokemon) }
    message += "}}\n\n"
    message
  end
end

def pokemon_info(pokemon)
  all_pokemon = YAML.load_file('list_of_pokemon.yml')
  
  "\"#{pokemon}\":\"https://assets.pokemon.com/assets/cms2/img/pokedex/detail/#{all_pokemon[pokemon]['Number']}.png\""
end

def matched_pokemons(text, terms)
  terms.select { |term| text.downcase.match(term.downcase)}
end

EM.schedule do
  TweetStream::Client.new.track(*tracked_terms) do |tweet|
    connections.each do |out| 
      if !tweet.retweet? && tweet.lang == 'en'
        out << stream_message(tweet, tracked_terms)
      end
    end
  end
end



# all_pokemon.keys #names of all pokemon


all_pokemon = YAML.load_file('list_of_pokemon.yml')

# http://stackoverflow.com/questions/3669674/streaming-data-from-sinatra-rack-application
# https://gist.github.com/maccman/2992949
