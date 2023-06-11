# Global Price Index API

### Table of Contents
- [Description](#Description)
- [Running the App](#Running-the-App)
- [Running tests](#Running-tests)
- [Calling the API](#Calling-the-API)



### Description
The app exposes the api - /v1/global-price-index
and returns the global price index. This is acheived by fetching the BTC/USDT order book from 
- Kraken via REST API 
- Huobi via REST API
- Binance via Websocket API

The tests are located in the \__tests\__ folder and the *src* folder contains the application logic designed in hexagonal architecture.
 
### Running the App
Clone this repo into your directory of choice and run the following in a terminal. 

```
cd <project_dir>
npm install
npm run start
```

By default it should expose the GET API on port 3031, but this can be changed by editing the .env properties with key *PORT*. 

### Running tests
Once the dependencies have been installed, run the following to run tests and generate the test reports. 
```
npm run test
```


### Calling the API
Once the server is running, invoke the API by calling this command in a separate terminal
```
curl --location --request GET 'localhost:3031/v1/global-price-index'
```






