import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { api } from '../../config/api';
import { Card } from 'react-native-paper';
import { Text } from '@ui-kitten/components';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation()
  const [bookings, setBookings] = useState([])
  const { user } = useSelector(state => state.auth);
  useEffect(() => {
    console.log(user)
  }, [])
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      if (user.user_role == 3) {
        api.get(`getuserbookings?user_id=${user.id}`)
          .then((response) => {
            console.log(response.data)
            setBookings(response.data)
          }).catch(err => {
            console.log(err.response)
          })
      } else if (user.user_role == 2) {
        api.get(`getmechanicbookings?mechanics_id=${user.id}`)
          .then((response) => {
            console.log(response.data)
          }).catch(err => {
            console.log(err.response)
          })
      }
    })();

    const unsubscribe = navigation.addListener('focus', async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      if (user.user_role == 3) {
        api.get(`getuserbookings?user_id=${user.id}`)
          .then((response) => {
            console.log(response.data)
            setBookings(response.data)
          }).catch(err => {
            console.log(err.response)
          })
      } else if (user.user_role == 2) {
        api.get(`getmechanicbookings?mechanics_id=${user.id}`)
          .then((response) => {
            console.log(response.data)
            setBookings(response.data)
          }).catch(err => {
            console.log(err.response)
          })
      }
    })

    return unsubscribe
  }, [navigation]);
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15 }}>
      <Text category='h3' style={{ fontWeight: 700 }}>Booking Log</Text>
      {bookings.length > 0 ? bookings.map((item, index) => {
        console.log(item)
        return (
          <Card style={{ width: "100%", padding: 15, marginBottom: 10 }} key={index} onPress={() => {
            if (user.user_role == 3) {
              navigation.navigate('BookingPayment', {
              mechanics_id: item.mechanics_id,
              total_price: item.total_price
            })
            }
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text category='h5' style={{ color: "#A02828" }}>{item.service_type}</Text>
              <Text category='h5' style={{ color: "#A02828" }}>P{item.total_price}</Text>
            </View>
            <Text category='c1' style={{ color: "#A02828" }}>{moment(item.created_at).format("LL")}</Text>
          </Card>
        )
      }) : (
        <Card style={{ width: "100%" }}>
          <Text>Book now to access your logs!</Text>
        </Card>
      )}
    </View>
  );
}

export default Home;