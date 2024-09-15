import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../../config/api";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Card, IconButton } from "react-native-paper";
import { Toast } from "toastify-react-native";
import { getMechanicBookings, getUserBookings, toggleFavoriteMechanic, unfavoriteMechanic } from "../../store/booking/Booking";
import Loading from "../../components/Loading";

const BookingHistory = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const { loading, bookingList, favoriteMechanic } = useSelector((state) => state.bookings);

  const refreshBookings = async () => {
    console.log('nag run')
    try {
      if (user.user_role == 3) {
        await dispatch(getUserBookings(user.id));
      } else {
        await dispatch(getMechanicBookings(user.id));
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", refreshBookings)

    return unsubscribe
  }, [navigation])

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

  const toggleFavorite = async (mechanics_id) => {
    const isFavorited = favoriteMechanic.includes(`${mechanics_id}`);

    const formdata = {
      user_id: user.id,
      mechanics_id: mechanics_id
    }

    if (isFavorited) {
      try {
        await dispatch(unfavoriteMechanic(formdata))
        Toast.success('Mechanic has been removed to favorites!')
      } catch (err) {
        Toast.success('There was a problem handling your transaction.')
      }
    } else {
      try {
        await dispatch(toggleFavoriteMechanic(formdata))
        Toast.success('Mechanic has been added to favorites!')
      } catch (err) {
        Toast.success('There was a problem handling your transaction.')
      }
    }
  }

  const renderBookingItem = ({ item, index }) => {
    const showIcon = index === bookingList.length - 1 || item.mechanics_id !== bookingList[index + 1]?.mechanics_id;
    const isFavorited = favoriteMechanic.includes(`${item.mechanics_id}`);

    return (

      <Card
        style={styles.card}
      >
        <TouchableOpacity 
        onPress={() =>
          navigation.navigate("BookingInfo", {
            booking_id: item.id,
          })
        }>
          <View style={styles.row}>
            <Text style={styles.serviceType}>{item.service_type}</Text>
            <Text style={styles.price}>P{item.total_price ?? "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.customerName}>
              {user.user_role == 2 && (
                <Text>
                  {item.first_name} {item.last_name}
                </Text>
              )}
              {user.user_role == 3 && (
                <Text>
                  {item.mechanics.first_name} {item.mechanics.last_name}
                </Text>
              )}

            </Text>
            <Text style={getStatusStyle(item.status)}>{item.status}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={styles.date}>{moment(item.created_at).format("LLL")}</Text>
            <Text style={styles.paymentMethod}>
              Payment Method: {item.mode_of_payment}
            </Text>
          </View>

          {showIcon && user.user_role == 3 && (
            <IconButton
              size={30}
              icon={isFavorited ? `heart` : `heart-outline`}
              iconColor="#A02828"
              onPress={() => toggleFavorite(item.mechanics_id)}
            />
          )}

        </View>

      </Card>
    )
  };

  return (
    <View style={styles.container}>
      <Loading loading={loading} />
      <Text style={styles.heading}>Booking History</Text>
      {bookingList.length > 0 ? (
        <FlatList
          data={bookingList}
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
