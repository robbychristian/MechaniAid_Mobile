import React, { useEffect, useState, useRef } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import {
  Alert,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Modal,
  Image,
} from "react-native";
import { api } from "../../../config/api";
import Loading from "../../components/Loading";
import * as Location from "expo-location";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import * as geolib from "geolib";
import { Toast } from "toastify-react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Add this for the back icon
import Icon from "react-native-vector-icons/FontAwesome";
import Pusher from "pusher-js";
import { getChatList } from "../../store/chat/Chat";
import * as Notifications from "expo-notifications";
import { ScrollView } from "react-native-gesture-handler";
import BookingChat from "../Chat/BookingChat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Booking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [nearbySearch, setNearbySearch] = useState([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const searchRotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const [declinedBookings, setDeclinedBookings] = useState([]);
  const [mechanicName, setMechanicName] = useState("");
  const [mechanicProfilePic, setMechanicProfilePic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBookingFoundModal, setShowBookingFoundModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const { chatList } = useSelector((state) => state.chat);
  const [bookingStarted, setBookingStarted] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [finalBookingDetails, setfinalBookingDetails] = useState([]);
  const [chatId, setChatId] = useState("");
  const [chatMechId, setChatMechId] = useState("");
  // const [senderName, setSenderName] = useState("");
  // const [receiverId, setReceiverId] = useState(null);
  const PUSHER_KEY = "4a125bbdc2a8a74fb388";
  const PUSHER_CLUSTER = "ap1";

  const [isModalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [isBookingCancelled, setIsBookingCancelled] = useState(false);

  const handleSenderName = () => {
    setNewMessage(true);
  };

  const toggleModal = (mechanics_id, chat_id) => {
    setChatMechId(mechanics_id);
    setChatId(chat_id);
    setModalVisible(!isModalVisible);
    setNewMessage(false);
  };

  if (user.user_role == 3) {
    const { service_type, vehicle_type, vehicle_name, mode_of_payment, other } =
      route.params;
    // Log the data received from the previous screen
    // console.log("Received data on Booking screen:", {
    //   service_type,
    //   vehicle_type,
    //   vehicle_name,
    //   mode_of_payment,
    //   other,
    // });
  }

  const handleBookingStarted = () => {
    setBookingStarted(true);
    console.log("Booking started in Parent component!");
  };

  const handleBookingCompleted = () => {
    setBookingCompleted(true);
    console.log("Booking Completed in Parent component!");
  };

  const startRotationAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop(); // Stop any ongoing animation
    }

    animationRef.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animationRef.current.start();
  };

  const startSearchRotationAnimation = () => {
    Animated.loop(
      Animated.timing(searchRotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };
  useEffect(() => {
    console.log(user);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        await dispatch(getChatList(user.id));
      } catch (err) {
        console.log(err);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!user || !user.id) {
      return; // Exit early if user or user.id is not defined
    }

    let pusher;
    let channel;
    if (user.user_role == 3 && isBooking) {
      // Initialize Pusher
      Pusher.logToConsole = true;
      pusher = new Pusher("b2ef5fd775b4a8cf343c", {
        cluster: "ap1",
        encrypted: true,
      });

      // Subscribe to channel
      channel = pusher.subscribe(`customer-notifications.${user.id}`);
      channel.bind("BookingAccepted", async (Data) => {
        if (Data.mechanicName) {
          setMechanicName(Data.mechanicName);
          setMechanicProfilePic(Data.mechanicProfilePic);
          setChatId(Data.chatId);
          setChatMechId(Data.mechanicId);
          setIsBooking(false);
          setShowModal(true);
          setIsAccepted(true);

          // Await the notification call
          try {
            await bookingAcceptedPushNotification(Data.mechanicName);
          } catch (error) {
            console.error("Error sending push notification:", error);
          }
        } else {
          console.log("Data or mechanicName not available.");
        }
      });

      channel.bind("BookingDeclined", (Data) => {
        if (Data.bookingStatus && Data.bookingId) {
          setTimeout(() => {
            if (
              Data.bookingStatus === "Pending" ||
              Data.bookingStatus === "Declined" ||
              Data.bookingStatus === "Assigned"
            ) {
              cancelBooking();
              Toast.warn("No Mechanics As of the Moment!");
            } // Pass the booking ID to checkBookingStatus
          }, 10000);
        } else {
          console.log("Data or mechanicName not available.");
        }
      });
    }

    if (user.user_role == 3 && isAccepted) {
      Pusher.logToConsole = true;
      pusher = new Pusher("b2ef5fd775b4a8cf343c", {
        cluster: "ap1",
        encrypted: true,
      });

      // Subscribe to channel
      channel = pusher.subscribe(`customer-notifications.${user.id}`);
      channel.bind("BookingStarted", async (Data) => {
        if (Data.bookingStatus && Data.bookingId) {
          console.log("Booking Started Worked!");
          setMechanicName(Data.mechanicName);
          setMechanicProfilePic(Data.mechanicProfilePic);
          setIsAccepted(false);
          setBookingStarted(true);

          try {
            await bookingStartedPushNotification();
          } catch (error) {
            console.error("Error sending push notification:", error);
          }
        } else {
          console.log("Data or mechanicName not available.");
        }
      });
    }

    if (user.user_role == 3 && bookingStarted) {
      Pusher.logToConsole = true;
      pusher = new Pusher("b2ef5fd775b4a8cf343c", {
        cluster: "ap1",
        encrypted: true,
      });

      // Subscribe to channel
      channel = pusher.subscribe(`customer-notifications.${user.id}`);
      channel.bind("BookingCompleted", (Data) => {
        if (Data) {
          console.log("Booking Completed Worked!");
          setfinalBookingDetails(Data);
          setBookingStarted(false);
          setBookingCompleted(true);
        } else {
          console.log("Data or mechanicName not available.");
        }
      });
    }

    // if(bookingStarted || isAccepted){
    Pusher.logToConsole = true;
    pusher = new Pusher("b2ef5fd775b4a8cf343c", {
      cluster: "ap1",
      encrypted: true,
    });

    channel = pusher.subscribe(`customer-notifications.${user.id}`);
    channel.bind("MessageSent", async (Data) => {
      if (Data) {
        // Dynamically show notification based on the role
        setNewMessage(true);
        if (user.id === Data.receiverId) {
          try {
            await newMessagePushNotification(Data.senderName);
          } catch (error) {
            console.error("Error sending push notification:", error);
          }
        }
      }
    });

    channel = pusher.subscribe(`mechanic-notifications.${user.id}`);
    channel.bind("BookingCancelled", async (Data) => {
      if (Data) {
        console.log("Booking Cancelled Worked!");
        Toast.warn("Booking Cancelled!");
        setShowBookingFoundModal(false);
        cancelSearch();
        try {
          await bookingCancelledPushNotification();
        } catch (error) {
          console.error(
            "Error sending push notification:",
            error
          );
        }
      } else {
        console.log("Data or mechanicName not available.");
      }
    });
    // }

    // Handle rotation animation
    if (isBooking) {
      startRotationAnimation();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      rotateAnim.setValue(0); // Reset rotation value when not booking
    }

    if (isSearching) {
      startSearchRotationAnimation();
    } else {
      searchRotateAnim.setValue(0);
    }
    // Fetch current location and check booking status
    const fetchLocationAndBookingStatus = async () => {
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        console.log(loc.coords);

        const response = await api.post("checkbooking", { user_id: user.id });

        // Check if the response contains the booking details
        if (response.data && response.data.id) {
          const bookingId = response.data.id; // Extract the booking ID
          console.log("Booking ID:", bookingId); // Log the booking ID to the console

          // setIsBooking(true);

          // Optionally, use the booking ID for further logic
          setTimeout(() => {
            checkBookingStatus(bookingId); // Pass the booking ID to checkBookingStatus
          }, 30000); // 30 seconds
        } else {
          console.log("No booking found.");
        }
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchLocationAndBookingStatus(); // Initial fetch

    const unsubscribe = navigation.addListener(
      "focus",
      fetchLocationAndBookingStatus
    );

    const interval = setInterval(async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [
    navigation,
    rotateAnim,
    isBooking,
    isSearching,
    isAccepted,
    bookingStarted,
    bookingCompleted,
    declinedBookings,
    user.id,
    user.user_role,
    newMessage,
  ]);

  const bookNow = () => {
    if (route.params && route.params.service_type) {
      const serviceTypeString = route.params.service_type.join(", "); // Convert array to string

      api
        .post("startbooking", {
          user_id: user.id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          longitude: location.longitude,
          latitude: location.latitude,
          service_type: serviceTypeString, // Pass the string instead of the array
          other_service_type: route.params.other,
          vehicle_type: route.params.vehicle_type,
          vehicle_name: route.params.vehicle_name,
          mode_of_payment: route.params.mode_of_payment,
          radius: 1000,
        })
        .then((response) => {
          setIsBooking(true);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      console.error("Service type is not defined in route params.");
    }
  };

  const checkBookingStatus = (bookingId) => {
    api
      .post("checkbookingstatus", { booking_id: bookingId }) // sending the booking_id
      .then((response) => {
        const bookingStatus = response.data.status; // accessing the status from response

        // If the booking is still Pending or Declined after 30 seconds, cancel the booking
        if (
          bookingStatus === "Pending" ||
          bookingStatus === "Declined" ||
          bookingStatus === "Assigned"
        ) {
          cancelBooking();
        }
      })
      .catch((err) => {
        console.log(err.response); // handling error
      });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const searchRotateInterpolate = searchRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (user.user_role == 3) {
          navigation.navigate("BookingDetails");
        } else {
          navigation.goBack();
        }

        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        // Cleanup the back handler
        backHandler.remove();
      };
    }, [navigation])
  );

  // const cancelBooking =  async () => {
  //   // setIsBooking(false);
  //   api
  //     .post("cancelbooking", {
  //       user_id: user.id,
  //     })
  //     .then((response) => {
  //       setIsBooking(false);
  //       if (isAccepted) {
  //         setIsAccepted(false);
  //       }
  //       if (bookingStarted) {
  //         setIsAccepted(false);
  //         setBookingStarted(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.response);
  //     });
  // };

  const cancelBooking = async () => {
    try {
      // Check booking status
      const response = await api.post("checkbooking", { user_id: user.id });
  
      // Verify that the response and booking ID are valid
      if (response && response.data && response.data.id) {
        const bookingId = response.data.id; // Extract the booking ID
        console.log("Booking ID after cancel:", bookingId);
  
        // Cancel the booking
        try {
          const cancelResponse = await api.post("cancelbooking", {
            user_id: user.id,
            booking_id: bookingId,
          });
  
          // Update UI states
          setIsBooking(false);
          if (isAccepted) {
            setIsAccepted(false);
          }
          if (bookingStarted) {
            setIsAccepted(false);
            setBookingStarted(false);
          }
        } catch (cancelError) {
          console.error(
            "Error cancelling booking:",
            cancelError.response || cancelError
          );
        }
      } else {
        console.warn("No valid booking ID found in response.");
      }
    } catch (checkError) {
      console.error(
        "Error checking booking:",
        checkError.response || checkError
      );
    }
  };

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let toastShown = false; // Add this at the top of your component or module

  const fetchAndAssignBooking = async () => {
    try {
      setIsSearching(true);

      const loc = await Location.getCurrentPositionAsync({});
      const userLocation = loc.coords;

      const requestPayload = {
        mechanics_id: user.id,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        declined_booking_ids: declinedBookings,
      };

      const response = await api.post("/assign-booking", requestPayload);
      const { booking, message, wait_time } = response.data;

      // Check if booking is not null and has required properties
      if (booking && booking.latitude && booking.longitude) {
        // const geocodeResponse = await fetch(
        //   `https://nominatim.openstreetmap.org/reverse?lat=${booking.latitude}&lon=${booking.longitude}&format=json&zoom=20&addressdetails=11`
        // );
        const geocodeResponse = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.504d8d0a6978c505a7c22459f545100c&lat=${booking.latitude}&lon=${booking.longitude}&format=json`
        );
        const geocodeData = await geocodeResponse.json();
        const locationName = geocodeData.display_name || "Unknown location";

        // Set booking details and show the modal
        setBookingDetails({
          ...booking,
          locationName,
        });

        setShowBookingFoundModal(true);
        const name = `${booking.first_name} ${booking.last_name}`;
        await schedulePushNotification(name);
      } else {
        if (!toastShown) {
          Toast.warn("No bookings within 1 km radius as of the moment.");
          toastShown = true;
        }

        // Introduce a delay before retrying
        // await new Promise((resolve) => setTimeout(resolve, wait_time || 15000));

        // fetchAndAssignBooking(); // Recursively search again after the delay
        cancelSearch();
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("API Error Response:", error.response.data);
        Toast.error(
          `Error: ${
            error.response.data.message ||
            "An error occurred while searching for bookings."
          }`
        );
        cancelSearch();
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Error Request:", error.request);
        Toast.error("No response received from the server.");
        cancelSearch();
      } else {
        // Something happened in setting up the request
        console.error("API Error Message:", error.message);
        Toast.error("Error: " + error.message);
        cancelSearch();
      }
    } finally {
      setIsSearching(false); // Reset searching state
    }
  };

  const searchNearby = () => {
    toastShown = false;
    api
      .post("mechanic-active", {
        mechanics_id: user.id,
      })
      .then((response) => {
        console.log("Mechanic Activity Status: ", response.data.message);
      })
      .catch((err) => {
        console.log(err.response);
      });
    fetchAndAssignBooking();
  };

  const cancelSearch = () => {
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
    setIsSearching(false);
    setNearbySearch([]);
  };

  const acceptBooking = async (item) => {
    setLoading(true);
    try {
      // Send API request to accept the booking
      const response = await api.post("acceptbooking", {
        booking_id: item.id,
        mechanics_id: user.id,
      });

      // Handle successful response
      console.log(response.data.message);
      navigation.navigate("AcceptBooking", {
        item: item,
        // onStartBooking: handleBookingStarted,
      });
    } catch (err) {
      console.error(err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileNavigation = () => {
    if (user.user_role == 3 && (isAccepted || bookingStarted)) {
      // navigation.navigate("MechanicProfile", { mechanicName });
      Alert.alert("Test Screen");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff" }}>
      <Loading loading={loading} />
      {location == null ? (
        <Loading loading={location == null} />
      ) : user.user_role == 3 ? (
        <>
          {!bookingCompleted && (
            <>
              <MapView
                style={{
                  width: "100%",
                  height:
                    isBooking || isAccepted || bookingStarted ? "70%" : "80%",
                }} // Adjust height based on isBooking
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.007,
                  longitudeDelta: 0.007,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Current Location"
                />
                <Circle
                  center={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  radius={1000}
                  fillColor={"rgba(239,68,68,0.2)"}
                  strokeWidth={0}
                />
              </MapView>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 30,
                  left: 20,
                  backgroundColor: "#ffffff",
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                onPress={() => navigation.navigate("BookingDetails")}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}

          {isBooking && (
            <View>
              <View style={styles.searchContainer}>
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <Icon name="cog" size={40} color="#EF4444" />
                </Animated.View>
                <Text style={styles.searchText}>
                  Searching for Mechanics...
                </Text>
              </View>
            </View>
          )}

          {isAccepted && (
            <View>
              <Text style={styles.statusText}>
                Your mechanic will be there shortly
              </Text>
              <View style={styles.mechanicInfoContainer}>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: mechanicProfilePic, // Mechanic's profile picture
                    }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <Text category="h6" style={styles.mechanicName}>
                  {mechanicName}
                </Text>
                <TouchableOpacity
                  // onPress={() =>
                  //   navigation.navigate("BookingChat", {
                  //     mechanics_id: chatMechId,
                  //     chat_id: chatId,
                  //   })
                  // }
                  onPress={() => toggleModal(chatMechId, chatId)}
                  style={styles.button}
                >
                  <MaterialCommunityIcons
                    name={newMessage ? "message-badge" : "message"}// Name of the icon
                    size={35} // Size of the icon
                    color="#EF4444" // Color of the icon
                    style={styles.chatIcon} // Any additional styling
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

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

          {bookingStarted && (
            <View>
              <Text style={styles.statusText}>Booking in Progress..</Text>
              <View style={styles.mechanicInfoContainer}>
                <TouchableOpacity onPress={handleProfileNavigation}>
                  <Image
                    source={{
                      uri: mechanicProfilePic, // Mechanic's profile picture
                    }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <Text category="h6" style={styles.mechanicName}>
                  {mechanicName}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleModal(chatMechId, chatId)}
                  style={styles.button}
                >
                  <MaterialCommunityIcons
                    name={newMessage ? "message-badge" : "message"} // Name of the icon
                    size={35} // Size of the icon
                    color="#EF4444" // Color of the icon
                    style={styles.chatIcon} // Any additional styling
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {bookingCompleted && (
            <ScrollView style={styles2.container}>
              <>
                <View style={styles2.card}>
                  <Text style={styles2.sectionTitle}>Booking Details 🛠️</Text>
                  <View style={styles2.detailItem}>
                    <Ionicons name="person" size={24} color="gray" />
                    <Text style={styles2.detailText}>
                      Customer Name:{" "}
                      <Text style={styles2.detailValue}>
                        {/* {route.params.first_name}{" "}
                          {route.params.last_name} */}{" "}
                        {finalBookingDetails.booking.first_name}{" "}
                        {finalBookingDetails.booking.last_name}
                      </Text>
                    </Text>
                  </View>
                  
                  <View style={styles2.detailItem}>
                    <FontAwesome
                      name={
                        route.params.vehicle_type == "Car"
                          ? "car"
                          : "motorcycle"
                      }
                      size={24}
                      color="gray"
                    />
                    <Text style={styles2.detailText}>
                      Vehicle Type:{" "}
                      <Text style={styles2.detailValue}>
                        {" "}
                        {finalBookingDetails.booking.vehicle_type}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles2.detailItem}>
                    <FontAwesome name="file-text" size={24} color="gray" />
                    <Text style={styles2.detailText2}>
                      Vehicle Name:{" "}
                      <Text style={styles2.detailValue}>
                        {" "}
                        {finalBookingDetails.booking.vehicle_name}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles2.detailItem}>
                    <FontAwesome name="wrench" size={24} color="gray" />
                    <Text style={styles2.detailText2}>
                      Service Type:{" "}
                      <Text style={styles2.detailValue}>
                        {" "}
                        {finalBookingDetails.booking.service_type}
                      </Text>
                    </Text>
                  </View>
                  {finalBookingDetails.booking.other_service_type &&
                    finalBookingDetails.booking.other_service_type.trim() !==
                      "" && (
                      <View style={styles2.detailItem}>
                        <FontAwesome name="list-alt" size={24} color="gray" />
                        <Text style={styles2.detailText2}>
                          Other Service Type:{" "}
                          <Text style={styles2.detailValue}>
                            {" "}
                            {finalBookingDetails.booking.other_service_type}
                          </Text>
                        </Text>
                      </View>
                    )}
                  <View style={styles2.detailItem}>
                    <FontAwesome name="credit-card" size={24} color="gray" />
                    <Text style={styles2.detailText2}>
                      Payment Method:{" "}
                      <Text style={styles2.detailValue}>
                        {" "}
                        {finalBookingDetails.booking.mode_of_payment}
                      </Text>
                    </Text>
                  </View>

                  <View style={styles2.breakdown}>
                    <Text style={styles2.breakdownHeader}>
                      Payment Details 🧾
                    </Text>
                    <View style={styles2.detailItem}>
                      <Text style={styles2.detailText}>
                        Initial Booking Fee:{" "}
                        <Text style={styles2.detailValue}>P100</Text>
                      </Text>
                    </View>
                    {finalBookingDetails.feeItems.map((item, index) => (
                      <View key={index} style={styles2.detailItem}>
                        <Text style={styles2.detailText}>
                          {item.description}:{" "}
                          <Text style={styles2.detailValue}>P{item.price}</Text>
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles2.detailItem}>
                    <FontAwesome name="money" size={24} color="gray" />
                    <Text style={styles2.detailText2}>
                      Total Price:{" "}
                      <Text style={styles2.detailValue}>
                        {" "}
                        P{finalBookingDetails.booking.total_price}
                      </Text>
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles2.startButton}
                  onPress={async () => {
                    if (finalBookingDetails.booking.mode_of_payment == "Cash") {
                      Toast.success("Booking Completed!");
                      navigation.navigate("Home"); // Logic for Cash payment
                      setBookingCompleted(false);
                      try {
                        await bookingCompletedPushNotification();
                      } catch (error) {
                        console.error(
                          "Error sending push notification:",
                          error
                        );
                      }
                    } else {
                      setBookingCompleted(false);
                      navigation.navigate("BookingPay", {
                        id: finalBookingDetails.booking.id,
                        user_id: finalBookingDetails.booking.user_id,
                      }); // Logic for other payment methods
                    }
                  }}
                >
                  <Text style={styles2.buttonText}>
                    {finalBookingDetails.booking.mode_of_payment == "Cash"
                      ? "Finish Booking"
                      : "Proceed to Payment"}
                  </Text>
                </TouchableOpacity>
              </>
            </ScrollView>
          )}

          {!bookingCompleted && (
            <>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  alignSelf: "center",
                  backgroundColor: "#fff",
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 50,
                    backgroundColor: "#EF4444",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                  }}
                  onPress={
                    isBooking || isAccepted || bookingStarted
                      ? cancelBooking
                      : bookNow
                  }
                >
                  <Text style={{ color: "#fff", fontFamily: "Nunito-Bold" }}>
                    {isBooking || isAccepted || bookingStarted
                      ? "Cancel Booking"
                      : "BOOK NOW"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.modalContainer}>
            <Modal
              visible={showModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    Congratulations 🎉{"\n"}We Found You A Mechanic!
                  </Text>
                  <Image
                    source={{ uri: mechanicProfilePic }}
                    style={styles.profilePic}
                  />
                  <Text style={styles.modalText}>🎉 {mechanicName}! 🎉</Text>
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </>
      ) : (
        <>
          <MapView
            style={{ width: "100%", height: isSearching ? "70%" : "80%" }} // Adjust height based on isBooking
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.007,
              longitudeDelta: 0.007,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Current Location"
              pinColor="rgb(14 116 144)"
            />
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={1000}
              fillColor={"rgba(239,68,68,0.2)"}
              strokeWidth={0}
            />

            {nearbySearch.length > 0 &&
              nearbySearch.map((item, index) => {
                if (item.booking_details != null) {
                  return (
                    <>
                      <Marker
                        coordinate={{
                          latitude: Number(item.booking_details.latitude),
                          longitude: Number(item.booking_details.longitude),
                        }}
                        title={`${item.first_name} ${item.last_name}'s location`}
                        key={index}
                        onPress={() => {
                          const isNearby = geolib.isPointWithinRadius(
                            {
                              latitude: location.latitude,
                              longitude: location.longitude,
                            },
                            {
                              latitude: Number(item.booking_details.latitude),
                              longitude: Number(item.booking_details.longitude),
                            },
                            1000
                          );
                          if (isNearby) {
                            Alert.alert(
                              "Accept this booking?",
                              "Are you sure you want to accept this booking?",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Accept",
                                  onPress: acceptBooking(item),
                                },
                              ]
                            );
                          } else {
                            Toast.error("Booking is too far");
                          }
                        }}
                      />
                      <Circle
                        center={{
                          latitude: Number(item.booking_details.latitude),
                          longitude: Number(item.booking_details.longitude),
                        }}
                        radius={1000}
                        fillColor={"rgba(239,68,68,0.2)"}
                        strokeWidth={0}
                      />
                    </>
                  );
                }
              })}
          </MapView>

          <TouchableOpacity
            style={{
              position: "absolute",
              top: 30,
              left: 20,
              backgroundColor: "#ffffff",
              borderRadius: 25,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
            }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {isSearching && (
            <View>
              <View style={styles.searchContainer}>
                <Animated.View
                  style={{ transform: [{ rotate: searchRotateInterpolate }] }}
                >
                  <Icon name="cog" size={40} color="#EF4444" />
                </Animated.View>
                <Text style={styles.searchText}>
                  Searching for Customers...
                </Text>
              </View>
            </View>
          )}

          <Modal
            visible={showBookingFoundModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBookingFoundModal(false)}
          >
            <View style={styles.bookingModalContainer}>
              <View style={styles.bookingModalContent}>
                <Text style={styles.bookingModalTitle}>Booking Found! 👨‍🔧</Text>
                <Text style={styles.bookingModalText}>
                  Customer Name:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.first_name} {bookingDetails.last_name}
                  </Text>
                </Text>
                <Text style={styles.bookingModalText}>
                  Location:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.locationName}
                  </Text>
                </Text>
                <Text style={styles.bookingModalText}>
                  Vehicle Type:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.vehicle_type}
                  </Text>
                </Text>
                <Text style={styles.bookingModalText}>
                  Vehicle Name:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.vehicle_name}
                  </Text>
                </Text>
                <Text style={styles.bookingModalText}>
                  Service Type:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.service_type}
                  </Text>
                </Text>
                {bookingDetails.other_service_type &&
                  bookingDetails.other_service_type.trim() !== "" && (
                    <Text style={styles.bookingModalText}>
                      Other Service Type:{" "}
                      <Text style={styles.bookingModalSubtext}>
                        {bookingDetails.other_service_type}
                      </Text>
                    </Text>
                  )}
                <Text style={styles.bookingModalText}>
                  Payment Method:{" "}
                  <Text style={styles.bookingModalSubtext}>
                    {bookingDetails.mode_of_payment}
                  </Text>
                </Text>
                <View style={styles.bookingModalButtons}>
                  <TouchableOpacity
                    style={styles.bookingDeclineButton}
                    onPress={async () => {
                      const updatedDeclinedBookings = [
                        ...declinedBookings,
                        bookingDetails.id,
                      ];
                      setDeclinedBookings(updatedDeclinedBookings);

                      try {
                        await api.post("/decline-booking", {
                          booking_id: bookingDetails.id,
                          mechanics_id: user.id,
                        });

                        setShowBookingFoundModal(false);
                        // fetchAndAssignBooking();
                        cancelSearch();
                      } catch (error) {
                        console.error(
                          "Decline Booking API Error:",
                          error.response
                        );
                        Toast.error(
                          "An error occurred while declining the booking."
                        );
                      }
                    }}
                  >
                    <Text style={{ color: "white", fontFamily: "Nunito-Bold" }}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookingAcceptButton}
                    onPress={async () => {
                      try {
                        await acceptBooking(bookingDetails);
                        setShowBookingFoundModal(false);
                      } catch (error) {
                        console.error(
                          "Accept Booking API Error:",
                          error.response
                        );
                        Toast.error(
                          "An error occurred while accepting the booking."
                        );
                      }
                    }}
                  >
                    <Text style={{ color: "white", fontFamily: "Nunito-Bold" }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignSelf: "center",
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: "#EF4444",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
              }}
              onPress={isSearching ? cancelSearch : searchNearby}
            >
              <Text style={{ color: "#fff", fontFamily: "Nunito-Bold" }}>
                {isSearching ? "Cancel Search" : "SEARCH NOW"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

async function schedulePushNotification(name) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking found!",
      body: `A booking request from ${name}`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function bookingAcceptedPushNotification(name) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking Accepted!",
      body: `Mechanic ${name}, accepted your booking`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function bookingStartedPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking Started!",
      body: `Your booking is now in progress`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function bookingCancelledPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking Cancelled!",
      body: `Customer cancelled the booking`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function bookingCompletedPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking Completed!",
      body: `Your booking is now completed`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

async function newMessagePushNotification(receiver_name) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Message Received!",
      body: `${receiver_name} sent a new message`,
      data: { data: "goes here" },
    },
    trigger: null,
  });
}

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    alignSelf: "center",
  },
  searchText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#000",
  },

  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 280,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    textAlign: "center",
    marginVertical: 10,
  },
  customButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  mechanicInfoContainer: {
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Vertically center the items
    justifyContent: "space-between", // Distribute space between items
    marginVertical: 30,
    alignSelf: "center",
    width: "85%", // Ensure it doesn't take full width
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10, // Add margin to the right for spacing
    borderWidth: 1,
    borderColor: "black",
  },

  mechanicName: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1, // Allow name to take available space
  },

  chatIcon: {
    marginLeft: 10, // Add margin to the left for spacing
  },

  statusText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#000",
    textAlign: "center", // Center the status text
  },

  bookingModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bookingModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  bookingModalTitle: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
  },
  bookingModalText: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    marginBottom: 10,
  },
  bookingModalSubtext: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    marginBottom: 10,
  },
  bookingModalButtons: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  bookingDeclineButton: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  bookingAcceptButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginLeft: 20
  }
});

const styles2 = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 5,
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
    paddingVertical: 10,
    borderBottomColor: "#EEE",
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Nunito-Regular",
    color: "#555",
  },
  detailText2: {
    fontSize: 16,
    marginLeft: 17,
    fontFamily: "Nunito-Regular",
    color: "#555",
  },
  detailValue: {
    fontFamily: "Nunito-Bold",
    color: "#444",
  },
  startButton: {
    height: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 100,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },
  breakdown: {
    marginBottom: 16,
    paddingVertical: 15,
    borderTopColor: "#EEE",
    borderTopWidth: 1,
  },
  breakdownHeader: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    marginBottom: 8,
    color: "#333",
  },
  badgeContainer: {
    position: "absolute", // Positioned relative to the chat icon
    top: -5, // Adjust to position it on the top right
    right: -5, // Adjust to position it on the top right
    backgroundColor: "red", // Red background
    borderRadius: 10, // Rounded badge
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff", // White text
    fontSize: 12, // Smaller font size
    fontWeight: "bold",
  }
});

export default Booking;
