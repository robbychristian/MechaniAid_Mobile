import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import BookingChat from "../Chat/BookingChat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Pusher from "pusher-js";
import { useSelector } from "react-redux";
const AcceptBooking = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [feeItems, setFeeItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [chatId, setChatId] = useState("");
  const [chatMechId, setChatMechId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const toggleModal = (mechanics_id, chat_id) => {
    setChatMechId(mechanics_id);
    setChatId(chat_id);
    console.log("Props Mech Id: ", mechanics_id);
    console.log("Props Chat Id: ", chat_id);
    setModalVisible(!isModalVisible);
    setNewMessage(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useFocusEffect(
    useCallback(() => {
      setFeeItems([]);
      setPrice("");
      setDescription("");
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
        // .get(
        //   `https://nominatim.openstreetmap.org/reverse?lat=${route.params.item.latitude}&lon=${route.params.item.longitude}&format=json&addressdetails=1`
        // )
        .get(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.504d8d0a6978c505a7c22459f545100c&lat=${route.params.item.latitude}&lon=${route.params.item.longitude}&format=json`
        )
        .then((response) => {
          setLoading(false);
          setAddress(response.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error fetching address:", err);
        });

      const focusListenerCleanup = navigation.addListener("focus", () => {
        console.log("Focused route params:", route.params.item);
      });

      return () => {
        focusListenerCleanup();
      };
    }, [route.params.item, navigation])
  );

  useEffect(() => {
    calculateTotalPrice();
    let pusher;
    let channel;
    Pusher.logToConsole = true;
    pusher = new Pusher("b2ef5fd775b4a8cf343c", {
      cluster: "ap1",
      encrypted: true,
    });

    channel = pusher.subscribe(`customer-notifications.${user.id}`);
    channel.bind("MessageSent", async (Data) => {
      setNewMessage(true);
    });
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [feeItems,newMessage]);

  const calculateTotalPrice = () => {
    const sum = feeItems.reduce(
      (total, item) => total + parseFloat(item.price || 0),
      0
    );
    setTotalPrice(sum + 100); // Add default fee of 100
  };

  const addFeeItem = () => {
    if (description && price) {
      setFeeItems([...feeItems, { description, price }]);
      setDescription("");
      setPrice("");
    } else {
      Toast.error("Please enter both description and price.");
    }
  };

  const removeFeeItem = (index) => {
    const updatedItems = feeItems.filter((_, i) => i !== index);
    setFeeItems(updatedItems);
  };

  const onSubmit = async (data) => {
    if (feeItems.length === 0) {
      Toast.error(
        "Please add at least one fee item before completing the booking."
      );
      return;
    }
    setLoading(true);
    try {
      await api.post("submitbooking", {
        booking_id: route.params.item.id,
        total_price: totalPrice, // Use the calculated total price
        fee_items: feeItems,
      });
      setLoading(false);
      Toast.success("Booking Completed!");
      api
      .post("mechanic-inactive", {
        mechanics_id: user.id,
      })
      .then((response) => {
        console.log("Mechanic Inactivity Status: ", response.data.message);
      })
      .catch((err) => {
        console.log(err.response);
      });
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
    <ScrollView style={styles.container}>
      {address == null ? (
        <Loading loading={loading} />
      ) : (
        <>
          <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)} // Close modal
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)} // Close modal
                style={styles.closeButton}
              >
                <Icon name="close" size={30} color="#000" />
              </TouchableOpacity>
              {/* Pass the state values as props to BookingChat */}
              <BookingChat mechanics_id={chatMechId} chat_id={chatId} />
            </View>
          </Modal>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle2}>Booking Details 🛠️</Text>
              <TouchableOpacity
                onPress={() =>
                  toggleModal(
                    bookingDetails.booking_details.user_id,
                    bookingDetails.chat_id
                  )
                }
                style={styles.chatIcon}
              >
                <MaterialCommunityIcons
                  name={newMessage ? "message-badge" : "message"} // Conditional icon name
                  // name={"message"}
                  size={35} // Size of the icon
                  color="#EF4444" // Color of the icon
                  style={styles.chatIcon} // Any additional styling
                />
              </TouchableOpacity>
            </View>
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
            <View style={styles.card2}>
              <Text style={styles.sectionTitle}>Add Fees 💸</Text>
              {feeItems.map((item, index) => (
                <View key={index} style={styles.feeItem}>
                  <Text style={styles.feeDescription}>{item.description}</Text>
                  <Text style={styles.feePrice}>P{item.price}</Text>
                  <TouchableOpacity onPress={() => removeFeeItem(index)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

              <TextInput
                style={styles.input}
                placeholder="Fee Description"
                value={description}
                onChangeText={setDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.addFeeButton}
                onPress={addFeeItem}
              >
                <Text style={styles.buttonText}>Add Fees</Text>
              </TouchableOpacity>

              <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>
                  Total Price: P{totalPrice}
                </Text>
                <Text style={styles.hintText}>
                  * The initial booking fee of P100 is automatically added in
                  the total price.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  {
                    backgroundColor:
                      feeItems.length > 0 ? "#EF4444" : "#D3D3D3",
                  },
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={feeItems.length === 0}
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
    </ScrollView>
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
  card2: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 100,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  feeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  feeDescription: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
  },
  feePrice: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    marginRight: 10,
  },
  totalPriceContainer: {
    marginVertical: 10,
  },
  totalPriceText: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
  },
  completeButton: {
    height: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 15,
  },
  addFeeButton: {
    height: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 15,
    width: "50%",
    alignSelf: "center", // This centers the button horizontally
    textAlign: "center", // Center the text inside the button
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
  hintText: {
    marginTop: 10,
    fontSize: 12,
    color: "#8f9bb3",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center", // This ensures vertical alignment
    justifyContent: "space-between", // Adjusts spacing between text and icon
  },
  sectionTitle2: {
    fontSize: 22,
    fontFamily: "Nunito-Bold",
    color: "#333",
    marginRight: 10, // Adds space between the emoji and the icon
  },
  chatIcon: {
    marginLeft: 10,
  },
});

export default AcceptBooking;
