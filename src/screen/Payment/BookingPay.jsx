import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import WebView from "react-native-webview";
import { Toast } from "toastify-react-native";
import * as Notifications from "expo-notifications";
const BookingPay = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const webViewRef = useRef(null);
    const [uri, setUri] = useState(decodeURI(`https://mechaniaid.com/api/paymentBooking/${id}`));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const decodedUri = decodeURI(`https://mechaniaid.com/api/paymentBooking/${id}`);
        setUri(decodedUri);

        const unsubscribe = navigation.addListener("focus", () => {
            setKey((prevKey) => prevKey + 1);
            setUri(decodedUri);
        });

        return unsubscribe;
    }, [navigation, uri]);

    const handleNavigationChange = async (event) => {
        const successUrl = `https://mechaniaid.com/api/paymentBooking/success/${id}`; // Change this to your success URL from the backend

        // Check if the WebView's URL matches the success URL
        if (event.url === successUrl) {
            // Navigate to Home.jsx upon successful payment
            try {
                await bookingCompletedPushNotification();
              } catch (error) {
                console.error("Error sending push notification:", error);
            }
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
export default BookingPay;
