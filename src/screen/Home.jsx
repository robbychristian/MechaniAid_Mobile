import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";

import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { api } from "../../config/api";
import { Card, Icon, IconButton } from "react-native-paper";
import { Text } from "@ui-kitten/components";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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

      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            justifyContent: "left",
            alignItems: "left",
            paddingVertical: 5,
            paddingHorizontal: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(user.user_role == 3 ? 'BookingDetails' : 'Booking')}
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
          <Text style={styles.subtitle}>{user.user_role == 3 ? 'Book A Mechanic' : 'Find Booking'}</Text>
        </View>

        {user.user_role == 2 && (
          <View
            style={{
              justifyContent: "left",
              alignItems: "left",
              paddingVertical: 5,
              paddingHorizontal: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("RebookRequests")}
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
              <Icon source={`book-refresh`} size={80} color="#58606e" />
            </TouchableOpacity>
            <Text style={styles.subtitle}>Rebooking Requests</Text>
          </View>
        )}

        {user.user_role == 3 && (
          <View
            style={{
              justifyContent: "left",
              alignItems: "left",
              paddingVertical: 5,
              paddingHorizontal: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("FavoriteMechanic")}
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
              <Icon source={`star`} size={100} color="#FFD403" />
            </TouchableOpacity>
            <Text style={styles.subtitle}>Favorite Mechanics</Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: "row" }}>
      {user.user_role == 3 && (
        <View
          style={{
            justifyContent: "left",
            alignItems: "left",
            paddingVertical: 5,
            paddingHorizontal: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("RebookRequests")}
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
            <Icon source={`book-refresh`} size={80} color="#58606e" />
          </TouchableOpacity>
          <Text style={styles.subtitle}>Rebooking Requests</Text>
        </View>
      )}

      </View>
    </View>
    
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '46fb1c38-dea0-4f72-ba4c-d1f20e8723c0' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

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
    alignSelf: "center",
  },
});
export default Home;
