import './header.css';
import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <div className="header">
          <div>
            <Link to='/'>GAME OF THRONES | D3</Link>
            <Link to='/matrix'>Matrix &amp; Bar Chart</Link>
            <Link to='/'>Force Layout</Link>
          </div>
          

          <div id="my-links">
            <a href="https://www.linkedin.com/in/valeryn/" target="_blank" rel="noopener noreferrer">LinkedIn</a><span>|</span>
            <a href="https://github.com/valery-nguyen" target="_blank" rel="noopener noreferrer">GitHub</a><span>|</span>
            <a href="https://angel.co/valeryn" target="_blank" rel="noopener noreferrer">AngelList</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;