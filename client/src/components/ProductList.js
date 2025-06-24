import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import './ProductCard.css'; // Assuming you have a CSS file for styling

const fallbackProducts = [
  {
    _id: 1,
    name: "Awesome Gadget",
    imageUrl: '/assets/Rubik.jpg',
    description: "The latest and greatest gadget.",
    price: 249.99,
    stock: 10,
  }
];

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dispatch } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                setProducts(fallbackProducts);
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="loading-message">Loading products...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // Helper to resolve image path
    const resolveImageUrl = (url) => {
        if (!url || typeof url !== 'string') return 'http://localhost:5000/assets/Rubik.jpg';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/assets/')) return 'http://localhost:5000' + url;
        // fallback for any other case
        return 'http://localhost:5000/assets/Rubik.jpg';
    };

    
    return (
        <div className="product-list">
            {products.length > 0 && (
                <div key={products[0]._id} className="product-card">
                    {products[0].imageUrl && (
                        <img src={resolveImageUrl(products[0].imageUrl)} alt={products[0].name} className="product-image" />
                    )}
                    <div className="product-info">
                        <h3 className="product-title">{products[0].name}</h3>
                        <p className="product-description-text">{products[0].description}</p>
                        <p className="product-price"><strong>Price: ${products[0].price.toFixed(2)}</strong></p>
                        <p className="product-stock">
                            {products[0].stock > 0 ? "In Stock" : "Out of Stock"}
                        </p>
                        <button className="add-to-cart-button" onClick={() => dispatch({ type: 'ADD_TO_CART', product: products[0] })}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;