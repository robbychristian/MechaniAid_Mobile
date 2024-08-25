import { Button, Card, Divider, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { api } from "../../../config/api";
import { IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";

const ProductCard = ({ item, onPress, onDelete }) => {
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState("");
  const win = Dimensions.get('window')

  const deleteItem = () => {
    api.delete(`/delete-product/${item.id}`)
      .then((response) => {
        console.log(response);
        onDelete();
        Toast.success("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      })
  }
  return (
    <Card onPress={onPress} style={{ marginHorizontal: 2, marginVertical: 2, width: win.width / 2 - 20 }}>
      <Image
        source={{
          uri: `https://www.mechaniaid.com/api/product-image/${item.product_image}`,
        }}
        style={{ height: 150, width: '100%', objectFit: "contain", marginBottom: 5 }}
      />
      <Text style={{ color: "#A02828", fontFamily: "Nunito-Regular", fontSize: 22 }}>
        {item.product_name}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
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

      <Divider style={{ marginVertical: 10 }} />
      {user.id == item.mechanics_id && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button size="tiny" status="warning" style={{ marginRight: 10 }} onPress={() => navigation.navigate("EditProduct", { id: item.id })}>Edit</Button>
        <Button size="tiny" status="danger" onPress={deleteItem}>Delete</Button>
      </View>}
    </Card>
  );
};

export default ProductCard;
