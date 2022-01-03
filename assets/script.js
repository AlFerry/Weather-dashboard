var searchButton = $('#search');
var textInput = $('#searchTerm');
var resultsPanel = $('#results-panel');
var dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

var APIKey = "986d3b239b9a3b7ebfe92d09a3750fbc";


function getWeather(){
    var lat;
    var lon;
    var search = textInput.val();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + APIKey;
    fetch(weatherURL)

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }

            throw Error("Search failed, please try again.");
        })
        .then(function (data){
            console.log(data);
            lat = data.coord.lat;
            lon = data.coord.lon;
            console.log(lat, lon);
        });
    var oneURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    fetch(oneURL)

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }

            throw Error("Search failed, please try again.");
        })
        .then(function(data){
            var currentTemp = ((data.current.temp - 273)*1.8)+32;
            console.log(currentTemp);
        });
        
        
        

}

searchButton.click(getWeather);