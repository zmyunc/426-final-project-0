import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import LoginPage from './loginpage';
import StockPage from './StockPage'; 
import ChooseUser from './ChooseUser'; // Import the new component
import EmployeePage from './EmployeePage';

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Function to check the current session
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-session', {
          credentials: 'include',
        });
        if (response.ok) {
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLogged(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  if (checkingSession) {
    return <div>Loading...</div>; // or some loading indicator
  }

  const ProtectedRoute = ({ children }) => {
    return isLogged ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        
      <Route path="/" element={isLogged ? <HomePage setIsLogged={setIsLogged} /> : <Navigate to="/login" />} />
      <Route path="/productdetail/:id" element={<ProductPage />} /> {/* Updated route */}

        <Route path="/login" element={<LoginPage setIsLogged={setIsLogged} />} />
        <Route path="/chooseuser" element={isLogged ? <ChooseUser setIsLogged={setIsLogged} /> : <Navigate to="/login" />} />
        <Route path="/employees" element={<EmployeePage setIsLogged={setIsLogged}/>} /> {/* New Route */}


        <Route path="/stock" element={isLogged ? <StockPage setIsLogged={setIsLogged} /> : <Navigate to="/login" />} />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App;
