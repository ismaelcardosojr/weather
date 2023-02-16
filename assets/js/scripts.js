const weatherApiKey = "";

const weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=";
const flagsApi = "https://flagsapi.com/";
const unsplashApi = "https://source.unsplash.com/1600x900/?";

const cityInp = document.querySelector("#city-inp");
const citySubmitBtn = document.querySelector("#city-submit-btn");
const suggestionsListItems = document.querySelectorAll("#suggestions-list li");
const suggestionsBox = document.querySelector(".suggestions-box");
const weatherBox = document.querySelector(".weather-box");
const errorMessage = document.querySelector("#error-message");

const background = document.querySelector(".background");
const city = document.querySelector("#city");
const countryFlag = document.querySelector("#country-flag");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const mainContainer = document.querySelector(".main-container");
const mainCard = document.querySelector(".main-card");

const loader = document.querySelector("#loader");

// Functions

const toggleLoader = () => {
    loader.classList.toggle("hide");
};

const getWeatherInfo = async (query) => {
    toggleLoader();

    const response = await fetch(weatherApi + query + "&appid=" + weatherApiKey);
    return await response.json();
};

const displayWeatherInfo = async (query) => {
    hideInfo();

    const data = await getWeatherInfo(query);

    if (data.cod === "404") {
        handleNotFoundCity();
        return;
    }

    const newFlag = flagsApi + data.sys.country + "/flat/64.png";
    countryFlag.setAttribute("src", newFlag);

    const newBackground = unsplashApi + query.replace(/\s/g, "");
    background.style.backgroundImage = `url(${newBackground})`;
    
    city.innerHTML = query;
    temperature.innerHTML = Math.round(data.main.temp - 273) + " °C";
    description.innerHTML = data.weather[0].description;
    humidity.innerHTML = data.main.humidity + "%";
    windSpeed.innerHTML = data.wind.speed + "km/h";

    setTimeout(() => {
        toggleLoader();

        background.style.opacity = "1";

        weatherBox.classList.remove("hide");
    }, 5000);
};

const hideInfo = () => {
    background.style.opacity = "0";

    suggestionsBox.classList.add("hide");
    weatherBox.classList.add("hide");
    errorMessage.classList.add("hide");
};

const handleNotFoundCity = () => {
    hideInfo();
    toggleLoader();
    
    errorMessage.classList.remove("hide");
};

// Events

citySubmitBtn.addEventListener("click", e => {
    e.preventDefault();

    let query = cityInp.value;
    
    if (!query) {
        return;
    }

    cityInp.value = "";

    displayWeatherInfo(query);
});

for (const currentListItem of suggestionsListItems) {
    currentListItem.addEventListener("click", () => {
        displayWeatherInfo(currentListItem.innerHTML);
    });
}