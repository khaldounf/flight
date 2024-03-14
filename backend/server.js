// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define your API routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working! 🚀' });
  });



  const Amadeus = require("amadeus");
  const amadeus = new Amadeus({
    
      /* clientId: 'QHXKGbrAW3oIvNqGWNK3sDUBDGW4Hgcl',
      clientSecret: 'C13siXwifhGQ3Og8' */
      clientId: '3GRlokKcNpcBNs49I5oq0zigHkscE8k7',
      clientSecret: 'CcvUh3h3NSgwrUna'
      
  });


  function getHoursFromDuration(durationString) {
    const durationRegex = /PT(\d+)H(\d+)M/;
    const match = durationString.match(durationRegex);
    if (match) {
      const hours = parseInt(match[1]);
      if(hours<=3)
      return hours;
    }
  
    return 'Invalid duration';
  }    


app.post('/flight-search', async (req, res) => {
  const searchData = req.body;
  /* const fromCityCode = await getCityCode(searchData.fromCityInput);
    const toCityCode = await getCityCode(searchData.toCityInput); */
    
  console.log('date...',searchData.departureDate);
  //console.log('from city...',searchData.fromCityInput);
  //console.log('to city...',searchData.toCityInput);
  console.log('from city...',searchData.fromCity);
  console.log('to city...',searchData.toCity);
    try {
    //const searchData = req.body;
    // const fromCityCode = await getCityCode(searchData.fromCity);
    // const toCityCode = await getCityCode(searchData.toCity);

    const fromCityCode = searchData.fromCity;
    const toCityCode = searchData.toCity;
    
    if (fromCityCode && toCityCode) {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: fromCityCode,
        destinationLocationCode: toCityCode,
        departureDate: searchData.departureDate,
        adults: searchData.numberOfAdults,
        children: searchData.children,
      });

      // Check if response is defined before accessing its properties
      if (response.data) {
        console.log(response.data);
        const filteredFlights = response.data.filter((flight) => {
          return getHoursFromDuration(flight.itineraries[0]?.duration) < 3;
        });
        res.json(filteredFlights);
      } else {
        // Handle non-success status code or undefined response
        console.error('Flight search failed:', response);
        res.status(500).json({ error: 'An error occurred while searching for flights' });
      }
    } else {
      res.status(400).json({ error: 'Invalid city names provided' });
    }
  } catch (error) {
    // Log the entire error object for more information
    console.error('Error searching for flights:', error);
    res.status(500).json({ error: 'An error occurred while searching for flights' });
  }  
});


// search cities to autocomplete
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
  const parameter = req.params.parameter;

  amadeus.referenceData.locations
      .get({
          keyword: parameter,
          // subType: Amadeus.location.any,
          // keyword: req.query.term,
          subType: 'AIRPORT,CITY'
      })
      .then(function (response) {
          res.send(response.result);
      })
      .catch(function (response) {
          res.send(response);
      });
});