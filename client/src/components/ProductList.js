import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import './ProductCard.css';

const API_URL = 'http://localhost:5000/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dispatch } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from API...');
                const response = await axios.get(`${API_URL}/products`);
                console.log('API Response:', response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const resolveImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300';
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button 
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return <div className="no-products">No products available</div>;
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product._id} className="product-card">
                    <div className="product-image-container">
                        <img 
                            src={resolveImageUrl(product.imageUrl)} 
                            alt={product.name} 
                            className="product-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300';
                            }}
                        />
                    </div>
                    <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="product-details">
                            <span className="product-price">${product.price?.toFixed(2)}</span>
                            <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <button 
                            className={`add-to-cart-btn ${product.stock <= 0 ? 'disabled' : ''}`}
                            onClick={() => dispatch({ type: 'ADD_TO_CART', product })}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;