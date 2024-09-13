
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native"
import WebView from "react-native-webview";
import { Toast } from "toastify-react-native";
const MarketPlacePay = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, user_id } = route.params;
    const webViewRef = useRef(null);
    const [uri, setUri] = useState(decodeURI(`http://192.168.1.13:8000/api/paymentMarketplace/${id}/${user_id}`));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const decodUri = decodeURI(`http://192.168.1.13:8000/api/paymentMarketplace/${id}/${user_id}`);
        setUri(decodUri)

        const unsubscribe = navigation.addListener("focus", () => {
            setKey((prevKey) => prevKey + 1);
            setUri(decodUri);
        });

        return unsubscribe;
    }, [navigation, uri, id])

    const handleNavigationChange = (event) => {
        const successUrl = `http://192.168.1.13:8000/api/paymentMarketplace/success/${id}/${user_id}`; // Change this to your success URL from the backend

        // Check if the WebView's URL matches the success URL
        if (event.url === successUrl) {
            // Navigate to Home.jsx upon successful payment
            Toast.success("Payment Completed!");
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
                source={{
                    uri: uri
                }}
                onNavigationStateChange={handleNavigationChange} // Add this to detect URL changes
            />


        </View>
    )
}

export default MarketPlacePay;