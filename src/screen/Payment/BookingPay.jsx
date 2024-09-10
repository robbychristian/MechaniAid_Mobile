import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import WebView from "react-native-webview";
import { Toast } from "toastify-react-native";

const BookingPay = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const webViewRef = useRef(null);
    const [uri, setUri] = useState(decodeURI(`http://192.168.1.7:8000/api/paymentBooking/${id}`));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const decodedUri = decodeURI(`http://192.168.1.7:8000/api/paymentBooking/${id}`);
        setUri(decodedUri);

        const unsubscribe = navigation.addListener("focus", () => {
            setKey((prevKey) => prevKey + 1);
            setUri(decodedUri);
        });

        return unsubscribe;
    }, [navigation, uri]);

    const handleNavigationChange = (event) => {
        const successUrl = `http://192.168.1.7:8000/api/paymentBooking/success/${id}`; // Change this to your success URL from the backend

        // Check if the WebView's URL matches the success URL
        if (event.url === successUrl) {
            // Navigate to Home.jsx upon successful payment
            Toast.success("Booking Completed!");
            navigation.navigate("Home");
        }
    };

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
                source={{ uri: uri }}
                onNavigationStateChange={handleNavigationChange} // Add this to detect URL changes
            />
        </View>
    );
};

export default BookingPay;
