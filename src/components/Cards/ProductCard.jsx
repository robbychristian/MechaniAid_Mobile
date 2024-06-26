import { Card, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { api } from "../../../config/api";

const ProductCard = ({ item, onPress }) => {
  const [imageUrl, setImageUrl] = useState("");
  const win = Dimensions.get('window')
  return (
    <Card onPress={onPress} style={{ marginHorizontal: 2, marginVertical: 2 }}>
      <Image
        source={{
          uri: `https://www.mechaniaid.com/api/product-image/${item.product_image}`,
        }}
        style={{ height: 150, width: '100%' }}
      />
      <Text category="h6" style={{ color: "#A02828" }}>
        {item.product_name}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">P{item.price}</Text>
        <Text
          category="label"
          style={{
            color:
              item.availability == "In Stock"
                ? "rgb(59 130 246)"
                : item.availability == "Only One"
                ? "rgb(249 115 22)"
                : "rgb(34 197 94)",
          }}
        >
          {item.availability}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">Location: {item.location}</Text>
      </View>
    </Card>
  );
};

export default ProductCard;
