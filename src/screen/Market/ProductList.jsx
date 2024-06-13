import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import ProductCard from '../../components/Cards/ProductCard';
import { api } from '../../../config/api';

const ProductList = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        api.get('getAllProducts').then((response) => {
            setProducts(response.data.product_details)
        }).catch(err => {
            console.log(err.response)
        })
    }, [])
    return (
        <View style={{ alignItems: "center" }}>
            {products.length > 0 && products.map((item, index) => {
                return (
                    <ProductCard item={item} />
                )
            })}
        </View>
    );
}

export default ProductList;