var API_KEY = "c635320f2e31180f0a0f3675c3ff26c0";

var isCelsius = true;
var lastWeatherData = null;
var lastForecastData = null;

var cityInput = document.getElementById("city-input");
var loading = document.getElementById("loading");
var errorDiv = document.getElementById("error");
var weatherBox = document.getElementById("weather-box");
var forecastBox = document.getElementById("forecast-box");

cityInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    searchWeather();
  }
});

function searchWeather() {
  var city = cityInput.value.trim();
  if (city == "") {
    showError("Please enter a city name.");
    return;
  }
  fetchWeather(city);
  fetchForecast(city);
}

function fetchWeather(city) {
  showLoading(true);
  hideError();
  weatherBox.style.display = "none";

  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";

  fetch(url)
    .then(function(res) {
      if (!res.ok) {
        throw new Error("City not found");
      }
      return res.json();
    })
    .then(function(data) {
      lastWeatherData = data;
      showWeather(data);
      showLoading(false);
    })
    .catch(function(err) {
      showLoading(false);
      if (err.message == "City not found") {
        showError("City not found. Please try again.");
      } else {
        showError("Something went wrong. Check your connection.");
      }
    });
}

function fetchForecast(city) {
  var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API_KEY + "&units=metric";

  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      lastForecastData = data;
      showForecast(data);
    })
    .catch(function(err) {
      // forecast error not critical, just hide it
      forecastBox.style.display = "none";
    });
}

function showWeather(data) {
  var temp = data.main.temp;
  var unit = "°C";

  if (!isCelsius) {
    temp = (temp * 9/5) + 32;
    unit = "°F";
  }

  document.getElementById("city-name").innerText = data.name + ", " + data.sys.country;
  document.getElementById("temp").innerText = Math.round(temp) + unit;
  document.getElementById("description").innerText = data.weather[0].description;
  document.getElementById("humidity").innerText = "Humidity: " + data.main.humidity + "%";
  document.getElementById("wind").innerText = "Wind: " + data.wind.speed + " m/s";
  document.getElementById("weather-icon").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  var realTemp = data.main.temp;
  if (realTemp <= 10) {
    document.body.style.background = "#cce0ff";
  } else if (realTemp <= 25) {
    document.body.style.background = "#d4f5d4";
  } else {
    document.body.style.background = "#ffe0b2";
  }

  weatherBox.style.display = "block";
}

function showForecast(data) {
  var cards = document.getElementById("forecast-cards");
  cards.innerHTML = "";


  var seen = [];
  var count = 0;

  for (var i = 0; i < data.list.length; i++) {
    var item = data.list[i];
    var date = item.dt_txt.split(" ")[0];

    if (item.dt_txt.includes("12:00:00") && !seen.includes(date)) {
      seen.push(date);
      count++;

      var card = document.createElement("div");
      card.className = "forecast-card";

      var temp = item.main.temp;
      var unit = "°C";
      if (!isCelsius) {
        temp = (temp * 9/5) + 32;
        unit = "°F";
      }

      card.innerHTML =
        "<p>" + date + "</p>" +
        "<img src='https://openweathermap.org/img/wn/" + item.weather[0].icon + ".png' />" +
        "<p>" + Math.round(temp) + unit + "</p>" +
        "<p>" + item.weather[0].description + "</p>";

      cards.appendChild(card);

      if (count == 5) break;
    }
  }

  forecastBox.style.display = "block";
}

function toggleUnit() {
  isCelsius = !isCelsius;

  var btn = document.querySelector("#weather-box button");
  if (isCelsius) {
    btn.innerText = "Switch to °F";
  } else {
    btn.innerText = "Switch to °C";
  }

  if (lastWeatherData) showWeather(lastWeatherData);
  if (lastForecastData) showForecast(lastForecastData);
}

function getLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      fetchByCoords(lat, lon);
    },
    function() {
      showLoading(false);
      showError("Could not get your location.");
    }
  );
}

function fetchByCoords(lat, lon) {
  var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";

  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      lastWeatherData = data;
      showWeather(data);
      showLoading(false);
    })
    .catch(function() {
      showLoading(false);
      showError("Failed to get weather for your location.");
    });

  fetch(forecastUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      lastForecastData = data;
      showForecast(data);
    });
}

function showLoading(state) {
  loading.style.display = state ? "block" : "none";
}

function showError(msg) {
  errorDiv.innerText = msg;
  errorDiv.style.display = "block";
}

function hideError() {
  errorDiv.style.display = "none";
}
