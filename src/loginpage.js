import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Weather from './Weather';
import './LoginPage.css'; // Make sure the CSS path is correct

function LoginPage({ setIsLogged }) {
  const navigate = useNavigate();
  const loginButtonRef = useRef(); // Create a ref for the login button

  useEffect(() => {
    const handleLogin = async () => {
      // Async function to handle the login process
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are sent with the request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secretKey: 'your-secret-key' }), // Your actual key or handling might differ
        });
        if (response.ok) {
          setIsLogged(true); // Update logged-in state
          navigate("/chooseuser"); // Navigate to another route on success
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    // Attach the event listener to the button
    const loginButton = loginButtonRef.current;
    if (loginButton) {
      loginButton.addEventListener('click', handleLogin);
    }

    // Clean up the event listener
    return () => {
      if (loginButton) {
        loginButton.removeEventListener('click', handleLogin);
      }
    };
  }, [setIsLogged, navigate]); // Dependencies for useEffect

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome to MR. Supermarket Management Systems</h1>
     
        <button ref={loginButtonRef} className="login-button">Login</button>
      </div>
      <div className="weather-display">
        <Weather cityId="4460162" />
    </div>
     
    </div>
  );
}

export default LoginPage;
