import './header.css';
import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <div className="header">
          <div>
            <Link to='/'><img src="/images/logo.png" alt="logo" /> | D3</Link>
            <Link to='/forcelayout' id="force-page" >Force Layout</Link>
            <Link to='/matrix' id="matrix-page">Matrix &amp; Bar Chart</Link>
          </div>
          

          <div id="my-links">
            <a href="https://www.linkedin.com/in/valeryn/" target="_blank" rel="noopener noreferrer">LinkedIn</a><span>|</span>
            <a href="https://github.com/valery-nguyen/GameOfThrones-D3" target="_blank" rel="noopener noreferrer">GitHub</a><span>|</span>
            <a href="https://angel.co/valeryn" target="_blank" rel="noopener noreferrer">AngelList</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;