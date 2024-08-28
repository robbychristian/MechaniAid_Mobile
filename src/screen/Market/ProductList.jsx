import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProductCard from "../../components/Cards/ProductCard";
import { api } from "../../../config/api";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProduct,
  getAllMechanicProducts,
  getAllProducts,
} from "../../store/products/Products";
import Loading from "../../components/Loading";
import { IconButton } from "react-native-paper";
import {
  Button,
  Card,
  IndexPath,
  Input,
  Select,
  SelectItem,
} from "@ui-kitten/components";

const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, productList } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(productList);
  const [selectedSortIndex, setSelectedSortIndex] = useState(new IndexPath(0)); // Initialize with an IndexPath object

  const sortOptions = ["Sort by Name", "Sort by Price"];

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

  useEffect(() => {
    let filteredProducts = [...productList];

    if (searchQuery.trim() !== "") {
      filteredProducts = filteredProducts.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const selectedSortOption = sortOptions[selectedSortIndex.row];

    switch (selectedSortOption) {
      case "Sort by Name":
        filteredProducts.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        break;
      case "Sort by Price":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filteredProducts);
  }, [searchQuery, productList, selectedSortIndex]);

  return (
    <View>
      <Loading loading={loading} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.heading}>Marketplace</Text>
            {user.user_role == 2 && (
              <Button
                size="small"
                style={{ backgroundColor: "#EF4141", borderColor: "#EF4141" }}
                onPress={() => navigation.navigate("AddProduct")}
              >
                Add Product
              </Button>
            )}
          </View>

          <Input
            placeholder="Search Products..."
            style={{ marginVertical: 5 }}
            onChangeText={(e) => setSearchQuery(e)}
          />

          <Select
            selectedIndex={selectedSortIndex}
            onSelect={(index) => setSelectedSortIndex(index)}
            value={sortOptions[selectedSortIndex.row]}
            style={{ marginVertical: 5 }}
          >
            {sortOptions.map((option, index) => (
              <SelectItem title={option} key={index} />
            ))}
          </Select>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => {
              return (
                <View style={styles.cardWrapper} key={index}>
                  <ProductCard
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
            })
          ) : (
            <Card
              style={{
                marginTop: 20,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No products in listing!</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  innerContainer: { 
    paddingHorizontal: 9, 
    paddingVertical: 8 
  },
  heading: {
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
    fontSize: 24, // Adjust the size for emphasis
    textAlign: "center", // Center the header
  },
  cardWrapper: { 
    marginBottom: 10,
    width: "100%", // Make the card take full width
    alignItems: "center", 
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    color: "#EF4141",
  },
  subtitle: {
    fontFamily: "Nunito-Light",
    fontSize: 15,
    marginLeft: 2,
  },
});
export default ProductList;
