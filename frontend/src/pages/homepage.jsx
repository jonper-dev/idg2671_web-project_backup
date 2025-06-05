import { useState } from 'react';
import Navbar from '../components/navBar.jsx';
import './styles/pages.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="page-container">
      <div className="home-page">
        <div className="top-section">
          <div className="home-title">Home page</div>
        </div>
        
        <div className="content-container">
          <div className="content-left">
            <h1 className="main-heading">Research studies made easy</h1>
            <p className="subtitle">Upload. Share. Learn.</p>
            <button className="learn-more-btn">Learn More</button>
          </div>
          
          <div className="content-right">
            <img 
              src="/homepage.svg" 
              alt="People analyzing research data" 
              className="research-illustration-homepage" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
