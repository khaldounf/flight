// SearchForm.js
import React, { useState, useEffect } from 'react';
import './SearchForm.css';

const SearchForm = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [fromCityOptions, setFromCityOptions] = useState([]);
  const [toCityOptions, setToCityOptions] = useState([]);

  useEffect(() => {
    const fetchCityOptions = async (input, setOptions, inputField) => {
      try {
        const response = await fetch(`http://localhost:3001/city-and-airport-search/${input}`);
        if (response.ok) {
          const data = await response.json();
        
          // Extracting the user input from the respective input field
          const userInput = inputField === 'from' ? fromCity : toCity;
  
          // Filter cities based on the user input
          let filteredCities = data.data.filter(
            (location) =>
              location.subType === 'CITY' && location.name.toLowerCase().startsWith(userInput.toLowerCase())
          );
  
          setOptions(filteredCities);
        } else {
          console.error('Failed to fetch city options:', response);
        }
      } catch (error) {
        console.error('Error fetching city options:', error);
      }
    };
  
    if (fromCity.length > 0) {
      fetchCityOptions(fromCity, setFromCityOptions, 'from');
    }
  
    if (toCity.length > 0) {
      fetchCityOptions(toCity, setToCityOptions, 'to');
    }
  }, [fromCity, toCity]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
      fromCity,
      toCity,
      fromAirport,
      toAirport,
      departureDate,
      returnDate,
      numberOfAdults,
    });

    try {
      const response = await fetch('http://localhost:3001/flight-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCity,
          toCity,
          fromAirport,
          toAirport,
          departureDate,
          returnDate,
          numberOfAdults,
        }),
      });

      if (response.ok) {
        const flightResults = await response.json();
        console.log('Flight search results:', flightResults);
      } else {
        console.error('Failed to send search request:', response);
      }
    } catch (error) {
      console.error('Error sending search request:', error);
    }
  };


  const handleCitySelect = async (option, setInput) => {
    
    await setInput === setFromCity ? setFromCityOptions([], setInput(option)) : setToCityOptions([], setInput(option));
    console.log('cleared options:', fromCityOptions, toCityOptions);
  };



  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>
            From City:
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />
            {fromCityOptions.length > 0 && (
              <div  key="fromCityAutocomplete" className="autocomplete">
                {fromCityOptions.map((option) => (
                  <div key={option.id} onClick={() => handleCitySelect(option.iataCode, setFromCity)}>
                    {option.address.cityName + ', ' +  option.name + ' (' + option.iataCode +')'}
                  </div>
                ))}
              </div>
            )}
          </label>
  
          <label>
            To City:
            <input
              type="text"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            />
            {toCityOptions.length > 0 && (
              <div key="toCityAutocomplete" className="autocomplete">
                {toCityOptions.map((option) => (
                  <div key={option.id} onClick={() => handleCitySelect(option.iataCode, setToCity)}>
                    {option.address.cityName + ', ' +  option.name + ' (' + option.iataCode +')'}
                  </div>
                ))}
              </div>
            )}
          </label>

          <label>
            From Airport:
            <input
              type="text"
              value={fromAirport}
              onChange={(e) => setFromAirport(e.target.value)}
            />
          </label>

          <label>
            To Airport:
            <input
              type="text"
              value={toAirport}
              onChange={(e) => setToAirport(e.target.value)}
            />
          </label>

          <label>
            Departure Date:
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </label>

          <label>
            Return Date:
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>

          <label>
            Number of Adults:
            <input
              type="number"
              value={numberOfAdults}
              onChange={(e) => setNumberOfAdults(e.target.value)}
              min="1"
            />
          </label>

          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
