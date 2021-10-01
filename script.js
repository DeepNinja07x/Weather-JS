let weather = {
    cityField: document.querySelector(".city"),
    iconField: document.querySelector(".icon"),
    descriptionField: document.querySelector(".description"),
    tempField: document.querySelector(".temp"),
    humidityField: document.querySelector(".humidity"),
    windField: document.querySelector(".wind"),
    apiKey: "5e1ddb8233f281231d95bf6718bddbb8",
    changeVisibilty: function (fields, value) {
        for (let field of fields) {
            field.style.visibility = value;
        }
    },
    fetchWeather: function (city) {
 main
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("Location not found.");
            throw new Error("Location not found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = Math.round(temp * 10) / 10 + "°C" + " / " + Math.round((temp*(9/5) + 32) * 10) / 10 + "°F";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    this.cityField.innerText = `Sorry, the weather in ${city} was not found, try again.`;
                    this.changeVisibilty([this.iconField, this.descriptionField, 
                        this.tempField, this.humidityField, this.windField], "hidden");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        this.changeVisibilty([this.iconField, this.descriptionField, 
            this.tempField, this.humidityField, this.windField], "visible");

        this.cityField.innerText = `Weather in ${name}`;
        this.iconField.src = `https://openweathermap.org/img/wn/${icon}.png`;
        this.descriptionField.innerText = description;
        this.tempField.innerText = ` ${temp} °C `;
        this.humidityField.innerText = `Humidity: ${humidity} %`;
        this.windField.innerText = `Wind speed: ${speed} km/h`;

        document.querySelector(".weather").classList.remove("loading");

        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
 main
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

weather.fetchWeather("Kolkata");