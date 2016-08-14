require 'sinatra'
require 'yaml'
require 'haml'
require 'tweetstream'
require 'pry'

set :server, 'thin'

TweetStream.configure do |config|
  config.consumer_key       = 'NdgZeu4tT2MDIFQzd8v2WHQ62'
  config.consumer_secret    = 'eFvcz52ecK4zsrDgQDz5QFTE0f2Xxh0S9ThSyh5NLPE79cnojd'
  config.oauth_token        = '31439619-5SBfSSz03mAHpkWTyAE8KxMbs3kGJzB73IlDO3PPS'
  config.oauth_token_secret = 'VQo28ZarlURy8VBO04vQBmcil94oBJwcjQFMcWuHwyZME'
  config.auth_method        = :oauth
end

# get '/:hashtag', provides: 'text/event-stream' do
#   stream :keep_open do |out|
#     out << random_tweet_about(params[:hashtag])
#   end
# end

# def random_tweet_about(hashtag)
#   TweetStream::Client.new.track(hashtag) do |tweet|
#     # binding.pry
#     return tweet.text
#   end
# end

#maybe user yield
get '/tweets' do
  content_type 'text/event-stream'
  stream :keep_open do |out|
    EventMachine::PeriodicTimer.new(1) do
      TweetStream::Client.new.track('Pikachu') do |tweet|
        out << { data: { message: tweet.text } }
      end
    end
  end
end

get '/' do
  haml :index
end

# all_pokemon = YAML.load_file('list_of_pokemon.yml')

# http://stackoverflow.com/questions/3669674/streaming-data-from-sinatra-rack-application
# https://gist.github.com/maccman/2992949
