import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Visualization from './main/visualization_container';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Content">
          <Switch>
            <Route path="/" component={Visualization} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;