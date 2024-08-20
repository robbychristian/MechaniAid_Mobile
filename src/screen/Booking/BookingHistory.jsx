import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { api } from "../../../config/api";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";

const BookingHistory = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const endpoint =
        user.user_role == 3 ? "getuserbookings" : "getmechanicbookings";
      const paramKey = user.user_role == 3 ? "user_id" : "mechanics_id";

      console.log(`${endpoint}?${paramKey}=${user.id}`)

      api
        .get(`${endpoint}?${paramKey}=${user.id}`)
        .then((response) => {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setBookings(sortedData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    })();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return [styles.status, styles.statusCompleted];
      case "Accepted":
        return [styles.status, styles.statusAccepted];
      case "Pending":
        return [styles.status, styles.statusPending];
      case "Cancelled":
        return [styles.status, styles.statusCancelled];
      default:
        return [styles.status, styles.statusDefault];
    }
  };

  const renderBookingItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("BookingPayment", {
          user_id: item.user_id,
          total_price: item.total_price,
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.serviceType}>{item.service_type}</Text>
        <Text style={styles.price}>P{item.total_price ?? "N/A"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.customerName}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={getStatusStyle(item.status)}>{item.status}</Text>
      </View>
      <Text style={styles.date}>{moment(item.created_at).format("LLL")}</Text>
      <Text style={styles.paymentMethod}>
        Payment Method: {item.mode_of_payment}
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking History</Text>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item, index) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>Book now to access your logs!</Text>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  heading: {
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
    fontSize: 24, // Adjust the size for emphasis
    textAlign: "center", // Center the header
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    width: "100%",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  serviceType: {
    fontFamily: "Nunito-Bold",
    color: "black",
    fontSize: 16,
  },
  price: {
    fontFamily: "Nunito-Bold",
    color: "black",
    fontSize: 16,
  },
  customerName: {
    fontFamily: "Nunito-Light",
    color: "black",
    fontSize: 14,
  },
  status: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    paddingHorizontal: 10, // Add horizontal padding
    paddingVertical: 5,    // Add vertical padding
    borderRadius: 5,      // Add border radius
    overflow: "hidden",    // Ensure the border radius is applied
  },
  statusCompleted: {
    backgroundColor: "green",
    color: "white",
  },
  statusAccepted: {
    backgroundColor: "#FFC107",
    color: "white",
  },
  statusPending: {
    backgroundColor: "orange",
    color: "white",
  },
  statusCancelled: {
    backgroundColor: "red",
    color: "white",
  },
  statusDefault: {
    backgroundColor: "gray",
    color: "white",
  },
  date: {
    fontFamily: "Nunito-Light",
    color: "black",
    fontSize: 12,
  },
  paymentMethod: {
    fontFamily: "Nunito-Light",
    color: "black",
    fontSize: 12,
  },
  emptyCard: {
    width: "100%",
    padding: 15,
  },
  emptyText: {
    fontFamily: "Nunito-Light",
    color: "black",
  },
});


export default BookingHistory;
