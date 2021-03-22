import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//scss file
import "./sass/main.scss";

//component
import Homepage from './components/home';

function App() {
  return (
    <div>
       <Router>
        {/* <ScrollToTop> */}
        <switch>
          <Route path="/" exact component={Homepage} />
        </switch>
        {/* </ScrollToTop> */}
      </Router>
    </div>
  );
}

export default App;

