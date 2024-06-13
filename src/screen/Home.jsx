import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

const Home = () => {
    const [errorMsg, setErrorMsg] = useState(null);
    const {user} = useSelector(state => state.auth);
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
        })();
      }, []);
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dashboard</Text>
        </View>
    );
}

export default Home;