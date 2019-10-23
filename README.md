# dori-twitter-bot


To config doribot you need a config.json in this format
```
{
    "consumer_key":         api_consumer key
  , "consumer_secret":      api_consumer secret
  , "access_token":         token_account
  , "access_token_secret":  secret_acoount
}
```

The account token and secret is the account which the bot will post the twetts.

And the currencyconfig.json with this following format
```
{"url" : "http://data.fixer.io/api/latest?access_key=TOKEN_HERE"}
``` 

Later, you only need use `node .`