import React, { useEffect, useState } from 'react';
import './App.css';

const APIKEY = "5bf3d90e97b9e21b14ec9cee422c866c";
const cities = ["London", "Barcelona", "Long Beach"];

const weatherImages = {
  Clear: 'Clear.png',
  Clouds: 'Cloud-background.png',
  Hail: 'Hail.png',
  Thunderstorm: 'Thunderstorm.png',
  Rain: 'HeavyRain.png',
  Drizzle: 'LightRain.png',
  Snow: 'Snow.png',
  Sleet: 'Sleet.png',
  Mist: 'Shower.png',
};

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [data, setData] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [inputCity, setInputCity] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [convertedTemp, setConvertedTemp] = useState(data ? Math.round(data.main.temp - 273.15) : null);

  const fetchData = async (city) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`);
      const data = await res.json();
      setData(data);
      if (isCelsius) {
        setConvertedTemp(Math.round(data.main.temp - 273.15));
      } else {
        setConvertedTemp(Math.round((data.main.temp * 9) / 5 + 32));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData(selectedCity);
  }, [selectedCity, isCelsius]); // Include isCelsius in the dependencies

  const handleCityChange = (city) => {
    setSelectedCity(city);
  }

  const toggleTemperatureUnit = (prevIsCelsius) => {
    setIsCelsius(!prevIsCelsius);
    if (data) {
      const newTemp = prevTemp => (prevIsCelsius ? Math.round((prevTemp * 9) / 5 + 32) : Math.round(((prevTemp - 32) * 5) / 9));
      setConvertedTemp(newTemp(data.main.temp - 273.15));
    }
  };

  const getFormattedDate = (date) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${day} ${month}`;
  }

  const handleSearchClick = () => {
    setShowInput(true);
  }

  const handleInputChange = (e) => {
    setInputCity(e.target.value);
  }

  const handleSearch = () => {
    if (inputCity) {
      setSelectedCity(inputCity);
      fetchData(inputCity);
      setShowInput(false);
      setInputCity("");
    }
  }

  const renderWeatherCards = () => {
    if (!data) return null;

    const currentDate = new Date();
    const weatherCards = [];
    const weatherImage = weatherImages[data.weather[0].main] || 'Clear.png';

    const todayCelsiusTemp = Math.round(data.main.temp - 273.15);
    weatherCards.push(
      <div key={0} className="today-card">
        <div className='conteiner'>
          <div className='element'>
            <div  className='elemen1'>
              <img src={`imagenes/${weatherImage}`} alt={data.weather[0].description} />
            </div>
            <div className='elemen2'>
              <p>{todayCelsiusTemp} <div className='grados'>°{isCelsius ? 'C' : 'F'}</div></p>
            </div>
            <div className='elemen3'>
              <p>{data.weather[0].description}</p>
            </div>
            <div className='elemen4'>
              <p>Today * {getFormattedDate(currentDate)}</p>
            </div>
            <div className='elemen5'>
              <p>{selectedCity}</p>
            </div>
          </div>
        </div>
      </div>
    );

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowCelsiusTempMax = Math.round(data.main.temp_max - 273.15);
    const tomorrowCelsiusTempMin = Math.round(data.main.temp_min - 273.15);
    weatherCards.push(
      <div key={1} className="day-card">
        <p>Tomorrow</p>
        <div>
          <img src={`imagenes/${weatherImage}`} alt={data.weather[0].description} className='imgDay' />
        </div>
        <div className="card-content">
          <p>{tomorrowCelsiusTempMax}°{isCelsius ? 'C' : 'F'}/{tomorrowCelsiusTempMin}°{isCelsius ? 'C' : 'F'}</p>
        </div>
      </div>
    );

    for (let i = 2; i <= 5; i++) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i);
      const nextWeatherImage = weatherImages['Clear'];
      const nextCelsiusTempMax = Math.round(data.main.temp_max - 273.15);
      const nextCelsiusTempMin = Math.round(data.main.temp_min - 273.15);

      weatherCards.push(
        <div key={i} className="day-card">
          <p>{getFormattedDate(nextDate)}</p>
          <div>
            <img src={`imagenes/${weatherImage}`} alt={data.weather[0].description} className='imgDay' />
          </div>
          <div className="card-content">
            <p>{nextCelsiusTempMax}°{isCelsius ? 'C' : 'F'}/{nextCelsiusTempMin}°{isCelsius ? 'C' : 'F'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className='container'>
          <div className="today-card1">
              {weatherCards[0]}
          </div>
          <div className="today-card2">
            <div className="temperature">
              <button id='tem' className={isCelsius ? 'active' : ''} onClick={() => toggleTemperatureUnit(isCelsius)}>
                °C
              </button>
              <button id='per' className={!isCelsius ? 'active' : ''} onClick={() => toggleTemperatureUnit(isCelsius)}>
                °F
              </button>
            </div>
            <div className="AlltoDay">
            {weatherCards.slice(1)}
            </div>
            <div className="H2">
            <p >Today's Hightlights</p>
            </div>
            <div className='DadToDay'>
             <div className='horizontalContainer'>
              <div className='toDay1'>
              <strong>Wind status</strong> 


              <div className='infodata'> 
              <br />{data.wind.speed} <div className='i'>mph</div>
              </div>

              </div>
              <div className='toDay2'>
              <strong>Visibility</strong> 
              <div className='infodata'> 
              <br />{(data.visibility / 1609.34).toFixed(2)} <div className='i'>miles</div>
              </div>
              </div>
              </div>
              <div className='horizontalContainer'>
              <div className='toDay1'>
               <strong>Humidity</strong> 
               <div className='infodata'>
               <br /> {data.main.humidity} <div className='i'> %</div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ borderBottom: '1px solid black', margin: '0 45px', padding: '0px 0' }}>0</span>
               <span style={{ borderBottom: '1px solid black', margin: '0 45px', padding: '0px 0' }}>50</span>
               <span style={{ borderBottom: '1px solid black', margin: '0 45px', padding: '0px 0' }}>100</span>
              </div>
              <div style={{ display: 'flex', width: '75%', backgroundColor: '#E7E7EB', height: '8px', borderRadius: '80px', margin:'0%', alignItems: 'center'}}>
              <div style={{ display: 'flex', width: `${data.main.humidity}%`, backgroundColor: '#FFEC65', height: '8px', borderRadius: '80px', margin:'0%', alignItems: 'center'}} />
             </div>
              </div>
              <div className='toDay2'>
                    <strong>Air Pressure</strong> 
                    <div className='infodata'> 
                   <br />{data.main.pressure} <div className='i'>mb</div>
                   </div>
             
              </div>
             </div>
             </div>
            </div>
          </div>
    );
  }

  return (
    <div className="today-card1">
      <div className="city-selector">
        {showInput ? (
          <>
            <input
              type="text"
              placeholder="Enter a city"
              value={inputCity}
              onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>
          </>
        ) : (
          <>
            <label htmlFor="citySelect">Search for places</label>
            <select id="citySelect" value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
            <button onClick={handleSearchClick}>Search</button>
          </>
        )}
      </div>
      {data && renderWeatherCards()}
    </div>
  );
}

export default App;
