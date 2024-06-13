import { Card, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { api } from "../../../config/api";

const ProductCard = ({ item }) => {
  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    api.get(`product-image/1718209722_mags.jpg`)
      .then((response) => {
        setImageUrl(response.data)
      })
  }, [])
  return (
    <Card disabled style={{ width: '100%' }}>
      <Image source={{ uri: imageUrl }} style={{ height: 200, width: 200, }} />
      <Text category="h5" style={{ color: "#A02828" }}>
        {item.product_name}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">P{item.price}</Text>
        <Text category="label">{item.availability}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">Location: {item.location}</Text>
      </View>
    </Card>
  );
};

export default ProductCard;
