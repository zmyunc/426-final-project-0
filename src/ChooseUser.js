import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Weather from './Weather'; // Import the Weather component
import './ChooseUser.css'; // Import the CSS file


const ChooseUser = ({ setIsLogged }) => {
  const navigate = useNavigate();
 

  useEffect(() => {

  }, []);

  const goToHome = () => {
    navigate('/');
  };

  const goToStock = () => {
    navigate('/stock');
  };
  const goToEmployeePage = () => {
    navigate('/employees');
  };

  const handleLogout = async () => {
    // Assuming you have an endpoint to clear the session
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Needed for cookies if you're using them
      });
      if (response.ok) {
        // Update the state and redirect to login
        setIsLogged(false);
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('There was an error logging out', error);
    }
  };

 return (
    <div className="choose-container">
        <div className="choose-box">
            <h1 className="choose-title">Choose Page</h1>
            <button className="button" onClick={goToHome}>Go to Home</button>
            <button className="button" onClick={goToStock}>Go to Stock Management</button>
            <button className="button" onClick={goToEmployeePage}>Employee Page</button>
            <button className="button" onClick={handleLogout}>Logout</button>
        </div>
        <div className="weather-display">
            <Weather cityId="4460162" className="weather-display" />
        </div>
    </div>
);
};
export default ChooseUser;
