import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './header/header';
import ForceLayout from './force_layout/force_layout_container';
import Matrix from './matrix/matrix_container';
import Footer from './footer/footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Content">
          <Header />
          <Switch>
            <Route exact path="/matrix" component={Matrix} />
            <Route exact path="/forcelayout" component={ForceLayout} />
            <Route path="/" component={ForceLayout} />
          </Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;