import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Weather from './Weather'; // Import the Weather component
import './HomePage.css'; // Adjust the path if necessary
import checkSession from './App'

function HomePage({ setIsLogged }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const goToStockPage = () => {
    navigate('/chooseuser');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(setProducts)
      .catch(error => console.error('Error fetching products:', error));
  }, []);

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

  const addToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  const subtractFromCart = (productId) => {
    const exists = cart.find(item => item.id === productId);
    if (exists.quantity === 1) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? {...item, quantity: item.quantity - 1} : item));
    }
  };

  const removeOneFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setCart(cart.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item));
      } else {
        removeFromCart(productId);
      }
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);


  const handleCheckout = () => {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const confirmation = window.confirm(`Your total price is $${totalPrice.toFixed(2)}. Are you sure you want to check out?`);
    if (confirmation) {
      window.alert('Your order has been placed!');
      // You can clear the cart here if needed
      setCart([]);
    }
  };


  return (
    <div className="home-container">

<div className="header-container">
      <h1>MR. Supermarket</h1>
    </div>
  

    <div className="nav-menu">
      
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToStockPage}>Go back to the menu</button>
    </div>


      <div className="products-section">
      {products.map(product => (
        <div key={product.id} className="product-container">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <h3><Link to={`/productdetail/${product.id}`}>{product.name}</Link> - ${product.price.toFixed(2)}</h3>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
          <button onClick={() => removeOneFromCart(product.id)} disabled={!cart.some(item => item.id === product.id)}>Remove One</button>
        </div>
      ))}
    </div>
    <div className="cart-container">
      <h2>Cart</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => addToCart(item)}>+</button>
                <button onClick={() => subtractFromCart(item.id)}>-</button>
                <button onClick={() => removeFromCart(item.id)}>Remove All</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
          <th colSpan="3">Total Price</th>
            <th>${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</th>
            <th><button onClick={handleCheckout} disabled={cart.length === 0}>Check out</button></th>
          </tr>
        </tfoot>
      </table>
   
    </div>
    
  );
}

export default HomePage;
