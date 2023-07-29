
// Function to get weather data for a city from the OpenWeather API
async function getWeatherData(city) {
    const apiKey = '7294cd9f83d12475284a0873d57ce046';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('City not found or API request failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      return null;
    }
  }
  
  // Function to display current weather conditions
  function displayCurrentWeather(data) {
    console.log(data)
    // Extract relevant data from the API response
    const cityName = data.city.name;
    const date = dayjs(data.list[0].dt * 1000).format('MMM D, YYYY');
    const iconCode = data.list[0].weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const temperature = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;

    // --> Let's say we DYNAMICALLY CREATE NEW CONTENT -- //
   // let dateTitle = document.createElement('h2');
   // console.log("New Element: ", dateTitle);   // --> <h2></h2>
   // dateTitle.setAttribute('id', 'date');
   // console.log("New Element: ", dateTitle);   // --> <h2 id="date"></h2>
   // dateTitle.textContent = date;
   // console.log("New Element: ", dateTitle);   // --> <h2 id="date">07/26/23</h2>

    // The element is now CREATED, has ATTRIBUTES, and CONTENT, and anything else we want to add
    // NOW the NEW ELEMENT has to be PUT ON THE SCREEN!!
    //let currentContainerDate = document.getElementById('date');
    //currentContainerDate.appendChild(dateTitle);


    // Update HTML elements to display the current weather conditions
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('date').textContent = date;
    document.getElementById('weather-icon').setAttribute('src', iconUrl);
    document.getElementById('temperature').textContent = temperature + 'F' ;
    document.getElementById('humidity').textContent = humidity + '%';
    const windSpeedMph = Math.floor(windSpeed * 2.2369)
    document.getElementById('wind-speed').textContent = windSpeedMph + ' mph'; 
  }
  
  // Function to display 5-day forecast
  function displayForecast(data) {
    
    // Extract relevant data for the next 5 days from the API response
    const forecastData = data.list.slice(1, 6);
  
    // Update HTML elements to display the 5-day forecast
    forecastData.forEach((item, index) => {
      const date = dayjs(item.dt * 1000).format('MMM D, YYYY');
      const iconCode = item.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
      const temperature = item.main.temp;
      const windSpeed = item.wind.speed;
      const humidity = item.main.humidity;
  
      document.getElementById(`date-${index + 1}`).textContent = date;
      document.getElementById(`weather-icon-${index + 1}`).setAttribute('src', iconUrl);
      document.getElementById(`temperature-${index + 1}`).textContent = temperature + '°F';
      document.getElementById(`wind-speed-${index + 1}`).textContent = windSpeed + ' m/s';
      document.getElementById(`humidity-${index + 1}`).textContent = humidity + '%';

     // document.getElementById("search-button").addEventListener('click', handleSearch)
    });
   
  }
  
  // Function to handle the search button click
  async function handleSearch() {
    const city = document.querySelector('.search-input').value.trim();
    if (!city) {
      alert('Please enter a city name.');
      return;
    }
  
    const weatherData = await getWeatherData(city);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);
      // Store the searched city in localStorage (you can modify the key as needed)
      localStorage.setItem('lastSearchedCity', city);
      // Update the search history display
      updateSearchHistory();
    }
  }
  
  // Function to update the search history display
  function updateSearchHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';
  
    // Retrieve the search history from localStorage (you can modify the key as needed)
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
    searchHistory.forEach((city) => {
      const historyItem = document.createElement('div');
      historyItem.textContent = city;
      historyItem.classList.add('history-item');
      historyItem.addEventListener('click', () => handleHistoryItemClick(city));
      historyContainer.appendChild(historyItem);
    });
  }
  
  // Function to handle clicks on a city in the search history
  async function handleHistoryItemClick(city) {
    const weatherData = await getWeatherData(city);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);
    }
  }
  
  // Event listener for the search button
  document.getElementById('search-button').addEventListener('click', handleSearch);
  
  // Initialize the weather dashboard with data for the last searched city (if available)
  const lastSearchedCity = localStorage.getItem('lastSearchedCity');
  if (lastSearchedCity) {
    document.querySelector('.search-input').value = lastSearchedCity;
    handleSearch();
  }
  
  // Update the search history display
  updateSearchHistory();
  