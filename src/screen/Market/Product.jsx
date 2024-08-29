import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../store/products/Products";
import Loading from "../../components/Loading";

const Product = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const route = useRoute();
  const dispatch = useDispatch();
  const { loading, product } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(route.params.id);
        await dispatch(getProduct(route.params.id));
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();

    const unsubscribe = navigation.addListener("focus", fetchProduct);

    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.id]);

  return (
    <View>
      <Loading loading={loading} />
      {product !== undefined && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Image
              source={{
                uri: `https://www.mechaniaid.com/api/product-image/${product.product_image}`,
              }}
              style={{ height: 300, width: "100%" }}
            />
            <View style={{ width: "90%" }}>
              <View style={{ marginVertical: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text category="h4" style={{ color: "#A02828" }}>
                    {product.product_name} (P{product.price})
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        product.availability == "In Stock"
                          ? "rgb(59 130 246)"
                          : product.availability == "Only One"
                            ? "rgb(249 115 22)"
                            : "rgb(34 197 94)",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 30,
                    }}
                  >
                    <Text category="c2" style={{ color: "#fff" }}>
                      {product.availability}
                    </Text>
                  </View>
                </View>
                <Text category="c1" style={{ color: "#777" }}>
                  {product.details}
                </Text>
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text category="h4" style={{ color: "#A02828" }}>
                  Seller Details
                </Text>
                <View>
                  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={{
                        uri: `https://www.mechaniaid.com/api/seller-image/${product.mechanics_info.mechanics_profile_pic}`,
                      }}
                      style={{ height: 125, width: 125, borderRadius: 100 }}
                    />
                  </View>
                  <View style={{ marginLeft: 0, justifyContent: "center" }}>
                    <Text category="h6">
                      Name:{" "}
                      <Text style={{ fontWeight: 400 }}>
                        {product.mechanics.first_name}{" "}
                        {product.mechanics.last_name}
                      </Text>
                    </Text>
                    <Text category="h6">
                      Location:{" "}
                      <Text style={{ fontWeight: 400 }}>
                        {product.location}
                      </Text>
                    </Text>
                    <Text category="h6">
                      Condition:{" "}
                      <Text style={{ fontWeight: 400 }}>
                        {product.condition}
                      </Text>
                    </Text>
                    <Text category="h6">
                      Brand:{" "}
                      <Text style={{ fontWeight: 400 }}>{product.brand}</Text>
                    </Text>
                  </View>
                </View>
              </View>
              {user.user_role == 3 && (
                <>
                  <Button
                    style={{
                      backgroundColor: "#A02828",
                      borderColor: "#A02828",
                    }}
                    onPress={() => navigation.navigate("Chat", {
                      mechanics_id: product.mechanics_id,
                    })}
                  >
                    MESSAGE NOW
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#fff",
                      borderColor: "#A02828",
                      marginVertical: 10,
                    }}
                    onPress={() =>
                      // navigation.navigate("Payment", {
                      //   mechanics_id: product.mechanics_id,
                      //   total_price: product.price,
                      // })
                      navigation.navigate("MarketPlacePay", {
                        id: product.id, user_id: user.id
                      })
                    }
                    appearance="outline"
                    status="danger"
                  >
                    BUY NOW
                  </Button>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Product;
