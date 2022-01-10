// Define global variables
var searchButton = $('#search');
var textInput = $('#searchTerm');
var todayBox = document.querySelector('#cityMain');
var resultsPanel = $('#results-panel');
var cityHistory = $('#cityHistory');
var histBtn = $('.hist')
var lat;
var lon;
var search;

var APIKey = "986d3b239b9a3b7ebfe92d09a3750fbc";


// Calls basic weather API to get Lat/Long coordinates from city input given by user
function weatherAPI(search){
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
            oneCall(search);
        }); 
}
// Function to put current search in history using local storage
function getWeather(){

    search = textInput.val();
    var savedSearches = JSON.parse(localStorage.getItem('history'));
    if (savedSearches==null) savedSearches=[];
    if(search!=""){
    savedSearches.push(search);
    localStorage.setItem("history", JSON.stringify(savedSearches));
    makeHistBtn(search);
    weatherAPI(search);}


}
// uses onecall API to retrieve current/forcasted weather for given city
function oneCall(search){

    var oneURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey +"&units=imperial";
    fetch(oneURL)

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }

            throw Error("Search failed, please try again.");
        })
        .then(function(data){
            var UnixTime = data.current.dt;
            console.log(UnixTime);
            var date= new Date(UnixTime * 1000);
            console.log(date);
            var day=date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var dispDate = month + "/" + day + "/" + year;
            var iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
            var uvi=data.current.uvi;
            if(uvi <= 2){
                    UVColor="green";
            }
            else if(uvi <=5){
                UVColor="yellow";
            }else{UVColor="red";}
            // Displays current weather on webpage
            var templateMain = 
                `<h2>${search} (${dispDate})<img id="wicon" src="${iconUrl}"></h2>
                <p>Temp: ${data.current.temp}&degF</p>
                <p>Wind: ${data.current.wind_speed} MPH</p>
                <p>Humidity: ${data.current.humidity} %</p>
                <p>UV Index: <span style="background-color:${UVColor}; border-radius:10px; padding: 2px 3px">${data.current.uvi}</span></p>`;
            todayBox.innerHTML = templateMain;
            // Displays 5-day forcast
            resultsPanel.empty();
            for(i=1; i<6; i++){
                var unixDt = data.daily[i].dt;
                var dateI= new Date(unixDt * 1000);
                console.log(dateI);
                var dayI =dateI.getDate();
                var monthI = dateI.getMonth() + 1;
                var yearI = dateI.getFullYear();
                var dispDateI = monthI + "/" + dayI + "/" + yearI;
                console.log(dispDateI);
                var templateI =
                `<div class="card cell medium-5" style="width:20%; background-color:#2F394D; border:0px; color:white; line-height:normal">
                <div class="card-divider" style="background-color:#2F394D">
                    <h4>${dispDateI}</h4>
                </div>
                  <div class="card-section">  
                    <img id="wicon"src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png">
                  </div>
                  <div class="card-section">
                    <p>Temp: ${data.daily[i].temp.day}&degF</p>
                    <p>Wind: ${data.daily[i].wind_speed} MPH</p>
                    <p>Humidity: ${data.daily[i].humidity} %</p>
                </div>`;

                resultsPanel.append($(templateI));
            }
        });
        
}
// Displays previously searched cities as buttons
function makeHistBtn(place){
    templateHistory = 
        `<div class="btn-rnd">
        <input type="button" class="hist" value="${place}" onclick="weatherAPI('${place}')"/>
        </div>`;
        cityHistory.append($(templateHistory));
}

// Gets history from local storage
function fillHistory(){
    var savedSearches = JSON.parse(localStorage.getItem('history'));
    cityHistory.innerHTML = "";
    if(!savedSearches) {
        return;
    }
    var histLength = savedSearches.length - 1;
    for(var i=histLength; i>=0; i--){
        var place = savedSearches[i];
        makeHistBtn(place);
    }
}

//When a user clicks a previously-searched city it is searched again
histBtn.click(function(event){
  let button = $(event.target);
  let value = button.val();
  weatherAPI(value);  
})
// Changes menu to be mobile-friendly
function myFunction(x) {
    $(".mobile-menu").toggleClass("menu-hidden", 800, "easeOutQuint");
  };

fillHistory();
searchButton.click(getWeather);

