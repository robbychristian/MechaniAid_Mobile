
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native"
import WebView from "react-native-webview";

const BookingPay = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, user_id } = route.params;
    const webViewRef = useRef(null);
    const [uri, setUri] = useState(decodeURI(`http://192.168.1.6:8000/api/paymentBooking/${id}/${user_id}`));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const decodUri = decodeURI(`http://192.168.1.6:8000/api/paymentBooking/${id}/${user_id}`);
        setUri(decodUri)

        const unsubscribe = navigation.addListener("focus", () => {
            setKey((prevKey) => prevKey + 1);
            setUri(decodUri);
        });

        return unsubscribe;
    }, [navigation, uri])
    return (
        <View style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        }}>
            <WebView
                key={key}
                ref={webViewRef}
                pullToRefreshEnabled
                style={{ width: 360, height: "100%" }}
                source={{
                    uri: uri
                }}
            />


        </View>
    )
}

export default BookingPay;