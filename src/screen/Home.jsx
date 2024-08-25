import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { api } from "../../config/api";
import { Card, Icon, IconButton } from "react-native-paper";
import { Text } from "@ui-kitten/components";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const Home = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(user);
  }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      api
        .get(`getuserbookings?user_id=${user.id}`)
        .then((response) => {
          console.log(response.data);
          setBookings(response.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    })();
  }, []);


  return (
    // <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: 'red' }}>
    //   <Text category='h3' style={{ fontWeight: 700 }}>Booking Log</Text>
    //   {bookings.length > 0 ? bookings.map((item, index) => {
    //     return (
    //       <Card style={{ width: "100%" }} key={index} onPress={() => navigation.navigate('BookingPayment', {
    //         mechanics_id: item.mechanics_id,
    //         total_price: item.total_price
    //       })}>
    //         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    //           <Text category='h5' style={{ color: "#A02828" }}>{item.service_type}</Text>
    //           <Text category='h5' style={{ color: "#A02828" }}>P{item.total_price}</Text>
    //         </View>
    //         <Text category='c1' style={{ color: "#A02828" }}>{moment(item.created_at)}</Text>
    //       </Card>
    //     )
    //   }) : (
    //     <Card style={{ width: "100%" }}>
    //       <Text>Book now to access your logs!</Text>
    //     </Card>
    //   )}
    // </View>
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          // borderWidth: 1,
          // borderColor: "black",
        }}
      >
        <View
          style={{
            justifyContent: "left",
            // alignItems: "left",
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}
        >
          <Text style={styles.title}>Hello, {user.first_name}!</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
        </View>

        <IconButton
        style={{
          marginTop: 15,
          position: "absolute",
          right: 0,
        }}
          icon={() => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={40}
              color="black"
            />
          )}
          onPress={() => navigation.navigate("Profile")}
        />
      </View>

      <View
        style={{
          justifyContent: "left",
          alignItems: "left",
          paddingVertical: 5,
          paddingHorizontal: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("BookingDetails")}
          style={{
            backgroundColor: "#f67070",
            height: 115,
            width: 115,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            marginBottom: 5,
          }}
        >
          <Image
            source={require("../../assets/mechanic.png")}
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Book A Mechanic</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
  },
  subtitle: {
    fontFamily: "Nunito-Light",
    fontSize: 15,
    marginLeft: 2,
  },
});
export default Home;
