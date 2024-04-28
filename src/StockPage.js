import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import Weather from './Weather'; // Import the Weather component


function StockPage({ isLogged, setIsLogged }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', price: '' });
    const [actionType, setActionType] = useState(null);
    const navigate = useNavigate();

const handleImageChange = (e) => {
  setSelectedImage(e.target.files[0]);
};
    const handleLogout = () => {
        // Perform the logout operation
        localStorage.removeItem('token'); // Or however you manage your auth tokens
        setIsLogged(false); // Update the login state
        navigate('/login'); // Redirect to the login page
      };

    const handleGoHome = () => {
        navigate('/chooseuser'); // Navigate to the homepage
      };

      useEffect(() => {
        fetch('http://localhost:5000/products')
          .then(response => response.json())
          .then(data => {
            const productsWithCorrectPrice = data.map(product => ({
              ...product,
              price: Number(product.price) // Convert price to a number
            }));
            setProducts(productsWithCorrectPrice);
          })
          .catch(error => console.error('Error fetching products:', error));
      }, []);

    const handleInputChange = (e) => {
        setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };


    ////////////////
    const resetActionType = () => {
        setActionType(null);
        setCurrentProduct({ id: '', name: '', price: '' });
      };

      const handleAction = (action) => {
        setActionType(action);
        // In case of update or delete, you might want to preload currentProduct with selected product details
      };

/////////////////

    const handleSubmit = (e) => {
        e.preventDefault();
        
        
        const price = Number(currentProduct.price);
        if (price < 0) {
            alert("Price must be greater than or equal to 0");
            return;
        }
        switch (actionType) {
            case 'add':
                fetch('http://localhost:5000/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: currentProduct.name, price: price }),
                })
                .then(response => response.json())
                .then(createdProduct => {
                    setProducts(currentProducts => [...currentProducts, createdProduct].sort((a, b) => a.id - b.id));
                    setCurrentProduct({ name: '', price: '' }); // Reset the form fields
                })
                .catch(error => console.error('Error:', error));
        
       
                break;


            case 'update':
                fetch(`http://localhost:5000/products/${currentProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: currentProduct.name, price: price }),
                })
                .then(response => response.json())
                .then(updatedProduct => {
                    setProducts(current => current.map(p => p.id === updatedProduct.id ? updatedProduct : p).sort((a, b) => a.id - b.id)); // Sort after updating
                    setCurrentProduct({ id: '', name: '', price: '' });
                    setActionType('');
                })
                .catch(error => console.error('Error:', error));
                break;


            case 'delete':
                fetch(`http://localhost:5000/products/${currentProduct.id}`, {
                    method: 'DELETE',
                })
                .then(() => {
                    setProducts(current => current.filter(p => p.id.toString() !== currentProduct.id).sort((a, b) => a.id - b.id)); // Sort after deleting
                    setCurrentProduct({ id: '', name: '', price: '' });
                    setActionType('');
                })
                .catch(error => console.error('Error:', error));
                break;
            default:
                // Reset or error
                break;
        }
    };

const handleAddProduct = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', currentProduct.name);
  formData.append('price', currentProduct.price);
  if (selectedImage) {
    formData.append('itemImage', selectedImage);
  }
  

  fetch('http://localhost:5000/products', {
    method: 'POST',
    body: formData, // Send FormData
  })
  .then(response => response.json())
  .then(createdProduct => {
    // You might need to add the full path for the image if it's not included in the response
    createdProduct.imageUrl = createdProduct.imageUrl || 'path-to-default-image/no-picture.jpg';
    setProducts(current => [...current, createdProduct]);
    setCurrentProduct({ name: '', price: '' });
    setSelectedImage(null); // Reset the selected image
  })
  .catch(error => {
    console.error('Error:', error);
  });
};



      const handleDeleteProduct = (e) => {
        e.preventDefault();
        const productId = currentProduct.id;
    
        fetch(`http://localhost:5000/products/${productId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            setProducts(products.filter(product => product.id.toString() !== productId));
          } else {
            throw new Error('Deletion failed');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };




   

      
    return (
        <div>
            <h1>Stock Management</h1>
            <Weather cityId="4460162" /> 
            <button onClick={handleLogout}>Logout</button>
      <button onClick={handleGoHome}>Go back to menu</button>
            <div>
                <button onClick={() => setActionType('add')}>Add Item</button>
                <button onClick={() => setActionType('update')}>Update Item</button>
                <button onClick={() => setActionType('delete')}>Delete Item</button>
            </div>


            {actionType === 'add' && (
        <form onSubmit={handleAddProduct}>
        <label>
          Name:
          <input
            type="text"
            value={currentProduct.name}
            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={currentProduct.price}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
            required
            min="0.01"
            step="0.01"
          />
        </label>
        <label>
        Image:
            <input
            type="file"
            name="itemImage"
            onChange={handleImageChange} // You'll implement this
            required
            />
        </label>
        <button type="submit">Add Item</button>
      </form>
      )}

      {actionType === 'update' && (
              <form onSubmit={handleSubmit}>
         <label>
         ID:
         <input
             type="text"
             name="id"
             value={currentProduct.id}
             onChange={handleInputChange}
             required
         />
  
           Name:
           <input
               type="text"
               name="name"
               value={currentProduct.name}
               onChange={handleInputChange}
               required
           />
    
           Price:
           <input
               type="number"
               name="price"
               value={currentProduct.price}
               onChange={handleInputChange}
               required
           />
       </label>
 <button type="submit">Update Item</button>
 </form>
     
      )}

      {actionType === 'delete' && (
        <form onSubmit={handleDeleteProduct}>
          <label>
            ID:
            <input
              type="text"
              name="id"
              value={currentProduct.id}
              onChange={(e) => setCurrentProduct({ ...currentProduct, id: e.target.value })}
              required
            />
          </label>
          <button type="submit">Delete Item</button>
        </form>
      )}

            <h2>Product List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>${product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockPage;
