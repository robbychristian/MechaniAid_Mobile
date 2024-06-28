import { Button, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react'
import * as DocumentPicker from "expo-document-picker";
import { Image, ScrollView, ToastAndroid, View,  } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { api } from '../../../config/api';

const BookingPayment = () => {
    const navigation = useNavigation()
    const {user} = useSelector(state => state.auth)
    const route = useRoute()
    const [fileUpload, setFileUpload] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setFileUpload(null)
        })
        return unsubscribe
    }, [navigation, route.params.mechanics_id])

    const uploadFile = async () => {
        console.log(route.params.mechanics_id)
        const result = await DocumentPicker.getDocumentAsync({})
        setFileUpload(result.assets[0])
    }

    const onSubmit = () => {
        const newFile = {
            uri: fileUpload.uri,
            type: "multipart/form-data",
            name: fileUpload.name,
        }
        const formdata = new FormData()
        formdata.append("mechanics_id", route.params.mechanics_id)
        formdata.append("user_id", user.id)
        formdata.append("first_name", user.first_name)
        formdata.append("middle_name", user.middle_name)
        formdata.append("last_name", user.last_name)
        formdata.append("total_price", route.params.total_price)
        formdata.append("status", "Pending")
        formdata.append("payment_for", "Booking")
        formdata.append("gcash_img", newFile)

        api.post('submitpayment', formdata)
            .then((response) => {
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                navigation.navigate('Home')
            }).catch(err => {
                console.log(err.response)
            })
    }
    
    return (
        <View style={{ width: "100%", paddingHorizontal: 15, paddingVertical: 10 }}>
            <ScrollView style={{ flexGrow: 1 }}>
                <View>
                    <Text category='h4' style={{ color: "#A02828", marginBottom: 10 }}>Scan and Pay!</Text>
                    <Image source={require('../../../assets/GCash.jpg')} style={{ width: '100%', height: 600 }} />
                </View>
                <Button onPress={fileUpload == null ? uploadFile : onSubmit} style={{ backgroundColor: "#A02828", borderColor: "#A02828", marginTop: 10 }}>{fileUpload == null ? `Upload Receipt Here` : `Submit Receipt`}</Button>
            </ScrollView>
        </View>
    );
}

export default BookingPayment;