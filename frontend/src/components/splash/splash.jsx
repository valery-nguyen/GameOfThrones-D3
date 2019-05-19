import './splash.css';
import React from 'react';
import { Link } from 'react-router-dom';

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
            <h1>GAME OF THRONES | D3</h1>
          </div>
          <hr/>
          <div className="site-description">
            <p>
              This App lets you explore the relationships between Game of Thrones
              characters through interactive data visualizations developed using D3.js
            </p>
            <Link to="/forcelayout"><button>Start Here</button></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Splash;