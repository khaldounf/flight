import React from 'react';
import ReactDOM from 'react-dom';
import MenuBar from './MenuBar';
import SearchForm from './SearchForm';
import MainSection from './MainSection';

const App = () => {
  return (
    <div className="app-container">
      <MenuBar />
      <MainSection />
      <div className="content-container">        
        <SearchForm />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;