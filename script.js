let weather = {
  cityField: document.querySelector(".city"),
  iconField: document.querySelector(".icon"),
  descriptionField: document.querySelector(".description"),
  tempField: document.querySelector(".temp"),
  humidityField: document.querySelector(".humidity"),
  windField: document.querySelector(".wind"),
  apiKey: keyConfig.apiKey,
  googleApiKey: keyConfig.googleApiKey, 
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
      fetch(
        `${urlConfig.openWeatherMapDataUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${weather.apiKey}`
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
        .then((data) => {
          this.queryPhotoReference(data)
          weather.displayWeather(data)
        });
    }, error => {
      weather.fetchWeather("Kolkata")
    })
  },



  toFarenheit: function (temp) {
    return Number(temp) * 1.8 + 32;
  },

  fetchWeather: function (city) {
    fetch(
      `${urlConfig.openWeatherMapDataUrl}?q=${city}&units=metric&appid=${this.apiKey}`
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
      .then((data) => {
        this.queryPhotoReference(data)
        this.displayWeather(data)
      });
  },

  queryPhotoReference: function (data) {
    fetch(
      `${urlConfig.googleApiUrl}/findplacefromtext/json?input=${data.name}&key=${weather.googleApiKey}&inputtype=textquery&locationbias=point:${data.coord.lat},${data.coord.lon}&fields=name,photo`
    )
      .then((response) => {
        if (!response.ok) {

          throw new Error("No photo reference found.");
        }
        return response.json();
      })
      .then((data) => {
        const photoReference = data?.candidates[0]
        if (photoReference.photos) {
          fetch(
            `${urlConfig.googleApiUrl}/photo?photoreference=${photoReference.photos[0].photo_reference}&key=${weather.googleApiKey}&maxheight=1600`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("No photo found.");
              }
              return response
            })
            .then((res) => {
              return document.body.style.backgroundImage = `url(${res.url})`;
            })
        } else {
          return document.body.style.backgroundImage = `url(${urlConfig.defaultBackgroundUrl})`;

        }
      })
      .catch((err) => console.log('err', err))

  },

  displayWeather: async function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    this.changeVisibilty([this.iconField, this.descriptionField,
    this.tempField, this.humidityField, this.windField], "visible");

    this.cityField.innerText = `Weather in ${name}`;
    this.iconField.src = `${urlConfig.openWeatherMapImageUrl}/wn/${icon}.png`;
    // const photo = await this.queryPhotoReference(data)
    this.descriptionField.innerText = description;
    this.tempField.innerText = ` ${temp} °C / ${this.toFarenheit(temp)} °F`;
    this.humidityField.innerText = `Humidity: ${humidity} %`;
    this.windField.innerText = `Wind speed: ${speed} km/h`;
    document.querySelector(".weather").classList.remove("loading");
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