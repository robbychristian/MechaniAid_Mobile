import React, { useEffect, useState, useRef } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import {
  Alert,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { api } from "../../../config/api";
import Loading from "../../components/Loading";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import * as geolib from "geolib";
import { Toast } from "toastify-react-native";
import { Ionicons } from "@expo/vector-icons"; // Add this for the back icon
import Icon from "react-native-vector-icons/FontAwesome";

const Booking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbySearch, setNearbySearch] = useState([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  const { service_type, vehicle_type, vehicle_name, mode_of_payment } =
    route.params;
  // Log the data received from the previous screen
  console.log("Received data on Booking screen:", {
    service_type,
    vehicle_type,
    vehicle_name,
    mode_of_payment,
  });

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

  useEffect(() => {
    if (isBooking) {
      startRotationAnimation();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      rotateAnim.setValue(0); // Reset rotation value when not booking
    }

    const unsubscribe = navigation.addListener("focus", async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log(loc.coords);
      api
        .post("checkbooking", {
          user_id: user.id,
        })
        .then((response) => {
          if (Number(response.data) > 0) {
            setIsBooking(true);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    });

    const interval = setInterval(async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log(loc.coords);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation, rotateAnim, isBooking]);

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


  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const cancelBooking = () => {
    // setIsBooking(false);
    api
      .post("cancelbooking", {
        user_id: user.id,
      })
      .then((response) => {
        setIsBooking(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const searchNearby = () => {
    api
      .get("getallnearbybooking")
      .then((response) => {
        console.log(response.data);
        setNearbySearch(response.data);
        setIsSearching(true);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setNearbySearch([]);
  };

  const acceptBooking = (item) => {
    setLoading(true);
    api
      .post("acceptbooking", {
        booking_id: item.id,
        user_id: user.id,
      })
      .then((response) => {
        setLoading(false);
        const mechanic = response.data.all_mechanics_info.mechanics;

        // Check if the user role is 3 before showing the Alert
        if (user.user_role === 3) {
          Alert.alert(
            "Booking Accepted",
            `You have accepted a booking for ${mechanic.first_name} ${mechanic.last_name}.`,
            [
              {
                text: "OK",
                onPress: () => {
                  // Navigate to the next screen or perform another action
                  navigation.navigate("AcceptBooking", {
                    item: item,
                  });
                },
              },
            ]
          );
        } else {
          // If the role is not 3, just navigate without showing the Alert
          navigation.navigate("AcceptBooking", {
            item: item,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff" }}>
      <Loading loading={loading} />
      {location == null ? (
        <Loading loading={location == null} />
      ) : user.user_role == 3 ? (
        <>
          <MapView
            style={{ width: "100%", height: isBooking ? "70%" : "80%" }} // Adjust height based on isBooking
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
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

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
              onPress={isBooking ? cancelBooking : bookNow}
            >
              <Text style={{ color: "#fff", fontFamily: "Nunito-Bold" }}>
                {isBooking ? "Cancel Booking" : "BOOK NOW"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <MapView
            style={{ width: "100%", height: "90%" }}
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
              height: "10%",
              width: "100%",
              backgroundColor: "#A02828",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0.5,
              borderColor: "#fff",
            }}
            onPress={isSearching ? cancelSearch : searchNearby}
          >
            <Text category="h5" style={{ color: "#fff" }}>
              {isSearching ? "Cancel Search" : "Search Nearby"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
});

export default Booking;
