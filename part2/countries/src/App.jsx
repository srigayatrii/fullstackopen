import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, latlng }) => {
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if (!weather) {
    return <div>Loading weather...</div>
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>

      <p>temperature {weather.main.temp} Celsius</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>

      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        width="150"
      />

      <Weather
        capital={country.capital[0]}
        latlng={country.capitalInfo.latlng}
      />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div>
      find countries

      <input
        value={search}
        onChange={handleSearchChange}
      />

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        filteredCountries.map(country => (
          <div key={country.name.common}>
            {country.name.common}

            <button onClick={() => setSearch(country.name.common)}>
              show
            </button>
          </div>
        ))
      ) : filteredCountries.length === 1 ? (
        <CountryDetails country={filteredCountries[0]} />
      ) : (
        <p>No matches found</p>
      )}
    </div>
  )
}

export default App