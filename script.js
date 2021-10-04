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


//get current geolocation weather data
    currentLoc: function () {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            console.log(lat, lon)
            fetch(
                "https://api.openweathermap.org/data/2.5/weather?lat=" +
                lat + "&lon=" + lon +
                "&units=metric&appid=" +
                weather.apiKey
            )
                .then((response) => {
                    if (!response.ok) {
                        weather.cityField.innerText = `Sorry, the weather in ${lat} ${lon} was not found, try again.`;
                        weather.changeVisibilty([weather.iconField, weather.descriptionField, 
                            weather.tempField, weather.humidityField, weather.windField], "hidden");
                        throw new Error("No weather found.");
                    }
                    return response.json();
                })
                .then((data) => weather.displayWeather(data)); 
        }, error => {
            console.error(error)
            weather.fetchWeather("Kolkata")
        })  
    },


    fetchWeather: function (city) {
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

weather.currentLoc()