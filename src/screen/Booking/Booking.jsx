import React, { useEffect, useState } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { TouchableOpacity, View } from "react-native";
import { api } from "../../../config/api";
import Loading from "../../components/Loading";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useSelector } from "react-redux";

const Booking = () => {
  const navigation = useNavigation()
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log(loc.coords);
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

  return (
    <View style={{ flex: 1 }}>
      {location == null ? (
        <Loading loading={location == null ? true : false} />
      ) : (
        <>
          <MapView
            style={{ width: "100%", height: "90%" }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
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
          >
            <Text category="h5" style={{ color: "#fff" }}>
              Book Now!
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Booking;
