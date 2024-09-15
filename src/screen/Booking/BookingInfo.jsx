import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Card } from "@ui-kitten/components";
import { useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { getBookingsById } from "../../store/booking/Booking";
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
        <View style={styles.container}>
            <Loading loading={loading} />
            {booking !== undefined && (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Card style={styles.card} status='danger'>
                        <Text style={styles.header}>User Details</Text>
                        <Text style={styles.detail}>Name: {booking.first_name} {booking.last_name}</Text>
                    </Card>

                    <Card style={styles.card} status='danger'>
                        <Text style={styles.header}>Booking Details</Text>
                        <Text style={styles.detail}>Mechanic: {booking.mechanics.first_name} {booking.mechanics.last_name}</Text>
                        <Text style={styles.detail}>Service Type: {booking.service_type}</Text>
                        <Text style={styles.detail}>Status: {booking.status}</Text>
                        <Text style={styles.detail}>Created at: {new Date(booking.created_at).toLocaleDateString()}</Text>
                    </Card>

                    <Card style={styles.card} status='danger'>
                        <Text style={styles.header}>Payment Details</Text>
                        <Text style={styles.detail}>Mode of Payment: {booking.mode_of_payment}</Text>
                        <Text style={styles.detail}>Total Price: P{booking.total_price}</Text>
                    </Card>
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9fc',
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        elevation: 3,  // Adds shadow for Android
        shadowColor: '#000',  // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        marginBottom: 8,
        color: '#333',
    },
    detail: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        fontFamily: 'Nunito-SemiBold'
    }
});

export default BookingInfo;
