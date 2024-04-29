import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductPage.css'; // Make sure the CSS path is correct

function ProductPage() {
    const navigate = useNavigate();  // Hook for programmatically navigating
    const { id } = useParams();      // Get the id from URL parameters
    const [product, setProduct] = useState(null);  // State to hold product data

    useEffect(() => {
        // Fetch product details from your API
        fetch(`http://localhost:5000/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    // Function to handle back navigation
    const handleBack = () => {
        navigate('/');
    };

    if (!product) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="product-detail-container">
            <button onClick={handleBack} className="back-to-home">Back to Home</button>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-price">Price: ${product.price.toFixed(2)}</p>
               <p className="product-description">{product.description}</p>
            </div>
        </div>
    );
}

export default ProductPage;
