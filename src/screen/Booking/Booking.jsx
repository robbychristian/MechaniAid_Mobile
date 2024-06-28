import React, { useEffect, useState } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { Alert, TouchableOpacity, View } from "react-native";
import { api } from "../../../config/api";
import Loading from "../../components/Loading";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import * as geolib from 'geolib';
import { Toast } from "toastify-react-native";

const Booking = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const {user} = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [isBooking, setIsBooking] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [nearbySearch, setNearbySearch] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log(loc.coords);
      api.post('checkbooking', {
        user_id: user.id
      }).then((response) => {
        if(Number(response.data) > 0) {
          setIsBooking(true)
        }
      }).catch(err => {
        console.log(err.response)
      })
    });

    const interval = setInterval(async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log(loc.coords);
    }, 5000);

    // Clean up the interval when the component unmounts or navigation focus changes
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation]);

  const bookNow = () => {
    api.post('startbooking', {
      user_id: user.id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      longitude: location.longitude,
      latitude: location.latitude,
      service_type: route.params.service_type,
      radius: 1000,
    }).then((response) => {
      setIsBooking(true);
      console.log(response.data)
    }).catch(err => {
      console.log(err.response)
    })
  }

  const cancelBooking = () => {
    api.post('cancelbooking', {
      user_id: user.id
    }).then((response) => {
      setIsBooking(false)      
    }).catch(err => {
      console.log(err.response)
    })
  }

  const searchNearby = () => {
    api.get('getallnearbybooking')
      .then(response => {
        console.log(response.data)
        setNearbySearch(response.data)
        setIsSearching(true)
      }).catch(err => {
        console.log(err.response)
      })
  }

  const cancelSearch = () => {
    setIsSearching(false)
    setNearbySearch([])
  }

  const acceptBooking = (item) => {
    setLoading(true)
    api.post('acceptbooking', {
      booking_id: item.id,
      user_id: user.id
    }).then((response) => {
      setLoading(false)
      navigation.navigate('AcceptBooking', {
        item: item
      })
    }).catch(err => {
      setLoading(false)
      console.log(err.response)
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <Loading loading={loading} />
      {location == null ? (
        <Loading loading={location == null ? true : false} />
      ) : user.user_role == 3 ? (
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
              height: "10%",
              width: "100%",
              backgroundColor: "#A02828",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0.5,
              borderColor: "#fff",
            }}
            onPress={isBooking ? cancelBooking : bookNow}
          >
            <Text category="h5" style={{ color: "#fff" }}>
              {isBooking ? "Cancel Booking" : "Book Now!"}
            </Text>
          </TouchableOpacity>
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
            {nearbySearch.length > 0 && nearbySearch.map((item, index) => {
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
                          {latitude: location.latitude, longitude: location.longitude},
                          {latitude: Number(item.booking_details.latitude), longitude: Number(item.booking_details.longitude)},
                          1000
                        )
                        if (isNearby) {
                          Alert.alert("Accept this booking?", "Are you sure you want to accept this booking?", [
                            {text: "Cancel", style: 'cancel'},
                            {text: "Accept", onPress: acceptBooking(item)}
                          ])
                        } else {
                          Toast.error('Booking is too far')
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
                )
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

export default Booking;
