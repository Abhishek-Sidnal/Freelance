import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();  // Getting the product ID from the URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(e => console.log(e));
    }, [id]);

    if (!product) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>{product.title}</h1>
            <img src={product.image} alt={product.title} style={{ width: '200px' }} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
        </div>
    );
}

export default ProductDetails;
