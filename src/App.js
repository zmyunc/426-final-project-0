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
    if (!isLogged) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they log in, which is a nicer user experience
      // than dropping them off on the home page.
      console.log(isLogged);
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage setIsLogged={setIsLogged} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productdetail/:id"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage setIsLogged={setIsLogged} />} />
        <Route
          path="/chooseuser"
          element={
            <ProtectedRoute>
              <ChooseUser setIsLogged={setIsLogged} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeePage setIsLogged={setIsLogged} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <StockPage setIsLogged={setIsLogged} />
            </ProtectedRoute>
          }
        />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App;
