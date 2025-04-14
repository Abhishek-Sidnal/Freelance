import React, { useState } from 'react'

const Products = () => {
    const [products, setProducts] = useState([])
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json()).then(data => setProducts(data)).catch(e => console.log(e))

    return (
        <div>
            {products.map(product => (<div key={product.id} >

                <img src={product.image} alt="" height={240} width={240} />
                {product.title}


            </div>))}
        </div>
    )
}

export default Products