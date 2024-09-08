import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const AcceptBooking = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useFocusEffect(
    useCallback(() => {
      const fetchBookingDetails = async () => {
        try {
          const response = await api.get(
            `/getBookingsById/${route.params.item.booking_id}`
          );
          setBookingDetails(response.data);
        } catch (err) {
          console.log("Error fetching booking:", err);
        }
      };

      fetchBookingDetails();

      setLoading(true);
      api
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${route.params.item.latitude}&lon=${route.params.item.longitude}&format=json&addressdetails=1`
        )
        .then((response) => {
          setLoading(false);
          setAddress(response.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error fetching address:", err);
        });

      // Use the cleanup function directly
      const focusListenerCleanup = navigation.addListener("focus", () => {
        console.log("Focused route params:", route.params.item);
      });

      return () => {
        // Cleanup on component unmount
        focusListenerCleanup(); // Call the cleanup function directly
      };
    }, [route.params.item, navigation])
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("submitbooking", {
        booking_id: route.params.item.id,
        total_price: data.total_price,
      });
      setLoading(false);
      Toast.success("Booking Completed!");
      navigation.navigate("Home");
    } catch (err) {
      setLoading(false);
      console.log(err.response);
    }
  };

  const onStart = async () => {
    setLoading(true);
    try {
      await api.post("startbookinginprogress", {
        booking_id: route.params.item.id,
      });

      const updatedBookingResponse = await api.get(
        `/getBookingsById/${route.params.item.booking_id}`
      );
      setBookingDetails(updatedBookingResponse.data);

      setLoading(false);
      Toast.success("Booking started!");

      // Notify the parent component (or handle it here)
      if (route.params.onStartBooking) {
        route.params.onStartBooking();
      }
    } catch (err) {
      setLoading(false);
      console.log("Error starting booking:", err);
      Toast.error("Failed to start the booking");
    }
  };

  return (
    <View style={styles.container}>
      {address == null ? (
        <Loading loading={loading} />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Booking Details 🛠️</Text>
            <View style={styles.detailItem}>
              <Ionicons name="person" size={24} color="gray" />
              <Text style={styles.detailText}>
                Customer Name:{" "}
                <Text style={styles.detailValue}>
                  {route.params.item.first_name} {route.params.item.last_name}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={24} color="gray" />
              <Text style={styles.detailText}>
                Location:{" "}
                <Text style={styles.detailValue}>{address.display_name}</Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome
                name={
                  route.params.item.vehicle_type == "Car" ? "car" : "motorcycle"
                }
                size={24}
                color="gray"
              />
              <Text style={styles.detailText}>
                Vehicle Type:{" "}
                <Text style={styles.detailValue}>
                  {route.params.item.vehicle_type}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="file-text" size={24} color="gray" />
              <Text style={styles.detailText2}>
                Vehicle Name:{" "}
                <Text style={styles.detailValue}>
                  {route.params.item.vehicle_name}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="wrench" size={24} color="gray" />
              <Text style={styles.detailText2}>
                Service Type:{" "}
                <Text style={styles.detailValue}>
                  {route.params.item.service_type}
                </Text>
              </Text>
            </View>
            {route.params.item.other_service_type &&
              route.params.item.other_service_type.trim() !== "" && (
                <View style={styles.detailItem}>
                  <FontAwesome name="list-alt" size={24} color="gray" />
                  <Text style={styles.detailText2}>
                    Other Service Type:{" "}
                    <Text style={styles.detailValue}>
                      {route.params.item.other_service_type}
                    </Text>
                  </Text>
                </View>
              )}
            <View style={styles.detailItem}>
              <FontAwesome name="credit-card" size={24} color="gray" />
              <Text style={styles.detailText2}>
                Payment Method:{" "}
                <Text style={styles.detailValue}>
                  {route.params.item.mode_of_payment}
                </Text>
              </Text>
            </View>
          </View>

          {bookingDetails?.booking_details.status !== "Accepted" ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Set Total Price 💸</Text>
              <CustomTextInput
                control={control}
                errors={errors}
                label="Total Price"
                message="Total Price is required"
                name="total_price"
                rules={{ required: true }}
              />
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.buttonText}>Complete Booking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Text style={styles.buttonText}>Start Booking</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Nunito-Bold",
    marginBottom: 15,
    color: "#333",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Nunito-Regular",
  },
  detailText2: {
    fontSize: 16,
    marginLeft: 17,
    fontFamily: "Nunito-Regular",
  },
  detailValue: {
    fontFamily: "Nunito-Bold",
    color: "#444",
  },
  completeButton: {
    height: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 15,
  },
  startButton: {
    height: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },
});

export default AcceptBooking;
