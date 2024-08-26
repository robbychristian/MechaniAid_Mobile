import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card } from "@ui-kitten/components";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { getBookingsById, rebooking } from "../../store/booking/Booking";
import { Text } from "react-native-paper";
import { Toast } from "toastify-react-native";

const BookingInfo = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    const route = useRoute();
    const dispatch = useDispatch();
    const { loading, booking } = useSelector((state) => state.bookings)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log(route.params.booking_id)
                await dispatch(getBookingsById(route.params.booking_id));
            } catch (err) {
                console.log(err.response)
            }
        }

        fetchProduct();

        const unsubscribe = navigation.addListener("focus", fetchProduct);

        return () => {
            unsubscribe();
        }
    }, [navigation, route.params.booking_id]);

    return (
        <View>
            <Loading loading={loading} />
            {booking !== undefined && (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 20 }}>
                        <Card>
                            <Text>User Details</Text>
                            <Text>Name: {booking.first_name} {booking.last_name}</Text>
                        </Card>

                        <Card>
                            <Text>Booking Details</Text>
                            <Text>Mechanics: {booking.mechanics.first_name} {booking.mechanics.last_name}</Text>
                            <Text>Service Type: {booking.service_type}</Text>
                            <Text>Status: {booking.status}</Text>
                            <Text>Created at: {booking.created_at}</Text>
                        </Card>

                        <Card>
                            <Text>Payment Details</Text>
                            <Text>Mode of Payment: {booking.mode_of_payment}</Text>
                            <Text>Total Price: {booking.total_price}</Text>
                        </Card>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default BookingInfo;