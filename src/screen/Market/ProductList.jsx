import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ProductCard from "../../components/Cards/ProductCard";
import { api } from "../../../config/api";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { clearProduct, getAllMechanicProducts, getAllProducts } from "../../store/products/Products";
import Loading from "../../components/Loading";
import { IconButton } from "react-native-paper";
import { Card } from "@ui-kitten/components";

const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, productList } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log(user)
      try {
        if (user.user_role == 3) {
          await dispatch(getAllProducts(1));
        } else {
          await dispatch(getAllMechanicProducts(user.id));
        }
        await dispatch(clearProduct())
      } catch (err) {
        console.log(err);
      }
    });
    return unsubscribe;
  }, [navigation]);  
  return (
    <View style={{ alignItems: "center", }}>
      <Loading loading={loading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%"
          }}
        >
          {productList.length > 0 ?
            productList.map((item, index) => {
              return (
                <ProductCard
                  key={index}
                  item={item}
                  onPress={() => {
                    console.log(item.id);
                    navigation.navigate("Product", {
                      id: item.id,
                    });
                  }}
                />
              );
            }) : <Card style={{ marginTop: 20, width: '90%', justifyContent: 'center', alignItems: "center" }}><Text>No products in listing!</Text></Card>}
        </View>
        {/* {user.user_role == 2 && (
          <IconButton
            onPress={() => console.log('try add')}
            icon={"plus-box"}
            size={50}
            iconColor="#A02828"
          />
        )} */}
      </ScrollView>
    </View>
  );
};

export default ProductList;
