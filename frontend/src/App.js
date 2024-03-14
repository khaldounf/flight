// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import SearchForm from './SearchForm';

const App = () => {
  return (
    <div>
      <h1>Flight and Hotel Search App</h1>
      <SearchForm />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;