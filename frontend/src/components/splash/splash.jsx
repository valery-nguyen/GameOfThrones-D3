import './splash.css';
import React from 'react';

class Splash extends React.Component {
  componentDidMount() {
    const matrixPage = document.getElementById("matrix-page");
    const forcePage = document.getElementById("force-page");
    if (forcePage.className.includes("selected")) {
      forcePage.classList.remove("selected");
    } else if (matrixPage.className.includes("selected")) {
      matrixPage.classList.remove("selected");
    }
  }

  render() {
    return (
      <div className="splash">
        <div>
          <div className="welcome-message">
            <p>Welcome to</p>
            <p>Game of Thrones | D3</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Splash;