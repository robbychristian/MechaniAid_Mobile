import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProductCard from "../../components/Cards/ProductCard";
import { api } from "../../../config/api";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { clearProduct, getAllMechanicProducts, getAllProducts } from "../../store/products/Products";
import Loading from "../../components/Loading";
import { IconButton } from "react-native-paper";
import { Button, Card } from "@ui-kitten/components";

const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, productList } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", async () => {
  //     console.log(user)
  //     try {
  //       if (user.user_role == 3) {
  //         await dispatch(getAllProducts(1));
  //       } else {
  //         await dispatch(getAllMechanicProducts(user.id));
  //       }
  //       await dispatch(clearProduct())
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  const refreshProducts = async () => {
    try {
      if (user.user_role == 3) {
        await dispatch(getAllProducts(1));
      } else {
        await dispatch(getAllMechanicProducts(user.id));
      }
      await dispatch(clearProduct());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", refreshProducts);
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <Loading loading={loading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
        <View style={{ paddingHorizontal: 9, paddingVertical: 8 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={styles.heading}>Marketplace</Text>
            {user.user_role == 2 && (
              <Button size="small" style={{ backgroundColor: "#EF4141", borderColor: "#EF4141" }} onPress={() => navigation.navigate("AddProduct")}>Add Product</Button>
            )}
          </View>

          {productList.length > 0 ?
            productList.map((item, index) => {
              return (
                <View style={{ alignItems: "center", }}>
                  <ProductCard
                    key={index}
                    item={item}
                    onPress={() => {
                      console.log(item.id);
                      navigation.navigate("Product", {
                        id: item.id,
                      });
                    }}
                    onDelete={refreshProducts}
                  />
                </View>
              );
            }) : <Card style={{ marginTop: 20, width: '100%', justifyContent: 'center', alignItems: "center" }}><Text>No products in listing!</Text></Card>}
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

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Nunito-Bold",
    fontSize: 24, // Adjust the size for emphasis
  },
})

export default ProductList;
