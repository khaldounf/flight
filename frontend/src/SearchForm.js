// SearchForm.js
import React, { useState, useEffect, useRef } from 'react';
import './SearchForm.css';


const SearchForm = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [fromCityOptions, setFromCityOptions] = useState([]);
  const [toCityOptions, setToCityOptions] = useState([]);
  const [flightOffers, setFlightOffers] = useState([]);

 
  


  
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
        setFlightOffers(flightResults);
        console.log('Flight search results:', flightResults);
        window.scroll(0, 2000);
      } else {
        console.error('Failed to send search request:', response);
      }
    } catch (error) {
      console.error('Error sending search request:', error);
    }
  };


 
  const handleCitySelect = (option, setInput) => {
    setInput(option);
    
    setInput === setFromCity ? setFromCityOptions([]) : setToCityOptions([]);
  };

  
  
  const handleOptionSelect = (option, setInput) => {
    setInput(option);
    setInput === setFromCity ? setFromCityOptions([]) : setToCityOptions([]);
  };


  const handleCity = (e, setInput) => {   
    setInput(e.target.value)
    setInput === setFromCity ? fetchCityOptions(fromCity, setFromCityOptions, 'from') : fetchCityOptions(toCity, setToCityOptions, 'to');
  };
  
  


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
  
  
  // Function to convert duration from PT format to hours and minutes
  const formatDuration = (duration) => {
    const durationPattern = /PT(\d+)H(\d+)M/;
    const match = duration.match(durationPattern);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return '';
  };



  



  return (
    <div >
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="citiesInputs">
            
          <label>
            From City
            </label>
           
            <input
              type="text"
              value={fromCity}
              onChange={(e) => handleCity(e, setFromCity)}             
            />
            {fromCityOptions.length > 0 && (
              <div  key="fromCityAutocomplete" className="autocompleteFrom">
                {fromCityOptions.map((option) => (
                  <div  key={option.id} onClick={() => handleOptionSelect(option.iataCode, setFromCity)}>
                    {option.address.cityName + ', ' +  option.name + ' (' + option.iataCode +')'}
                  </div>
                ))}
              </div>
            )}
           
          
          
          


          <label>
            To City
            </label>
            <input
              type="text"
              value={toCity}
              onChange={(e) => handleCity(e, setToCity)} 
            />
            {toCityOptions.length > 0 && (
              <div key="toCityAutocomplete" className="autocompleteTo">
                {toCityOptions.map((option) => (
                  <div key={option.id} onClick={() => handleCitySelect(option.iataCode, setToCity)}>
                    {option.address.cityName + ', ' +  option.name + ' (' + option.iataCode +')'}
                  </div>
                ))}
              </div>
            )}
          
          </div>

        <div className="airports">
          <label>
            From Airport
            </label>
            <input
              type="text"
              value={fromAirport}
              onChange={(e) => setFromAirport(e.target.value)}
            />
          

          <label>
            To Airport
            </label>
            <input
              type="text"
              value={toAirport}
              onChange={(e) => setToAirport(e.target.value)}
            />
          </div>

        <div className="dates">
          <label>
            Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          

          <label>
            Return Date
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />

          </div>
          
        <div className="persons">
          <div className="adults">
          <label>
            Adults (+16)
            </label>
            <input
              type="number"
              value={numberOfAdults}
              onChange={(e) => setNumberOfAdults(e.target.value)}
              min="1"
            />
            </div>
        
        <div className="children">
          <label>
            Children (+2)
            </label>
            <input
              type="number"
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
              min="1"
            />
            </div>

            </div>
          

          <button type="submit">Search</button>
        </form>
      </div>


     

     

      </div>



      <h2>Flight Offers</h2>
      <div className="flight-offers">
      
        {flightOffers.map((offer, index) => (
          <div key={index} className="flight-offer">
            {offer.itineraries.map((itinerary, idx) => (
              <div key={idx}>
                <p className="durationText">Total Duration</p>
                <p className="duration">{formatDuration(itinerary.duration)}</p>
                <p className="departureText">Departure</p>
                <p className="departureDateTime">{new Date(itinerary.segments[0].departure.at).toLocaleDateString()}</p>
                <p className="departureDateTime">{new Date(itinerary.segments[0].departure.at).toLocaleTimeString()}</p>
                <p className="arrivalText">Arrival</p>
                <p className="arrivalDateTime">{new Date(itinerary.segments[0].arrival.at).toLocaleDateString()}</p>
                <p className="arrivalDateTime">{new Date(itinerary.segments[0].arrival.at).toLocaleTimeString()}</p>
                
                
                
              </div>
            ))}
           
            <p className="priceText">Total Price</p>
            <p className="price">{offer.price.total} {offer.price.currency}</p>
            
          </div>
        ))}
      </div>




    </div>
  );
};

export default SearchForm;
