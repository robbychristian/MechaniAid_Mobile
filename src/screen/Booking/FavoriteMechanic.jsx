import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../components/Loading";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearBooking, getBookingsByFavoriteMechanic } from "../../store/booking/Booking";
import { Card } from "@ui-kitten/components";
import moment from "moment";

const FavoriteMechanic = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading, favoriteBookings } = useSelector((state) => state.bookings)

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            try {
                await dispatch(getBookingsByFavoriteMechanic(user.id))
                await dispatch(clearBooking());
            } catch (err) {
                console.log(err.response)
            }
        })

        return unsubscribe;
    }, [navigation])

    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed":
                return [styles.status, styles.statusCompleted];
            case "Accepted":
                return [styles.status, styles.statusAccepted];
            case "Pending":
                return [styles.status, styles.statusPending];
            case "Cancelled":
                return [styles.status, styles.statusCancelled];
            default:
                return [styles.status, styles.statusDefault];
        }
    };

    const renderBookingItem = ({ item, index }) => {
        return (

            <Card
                style={styles.card}
            >
                <TouchableOpacity onPress={() =>
                    navigation.navigate("BookingInfo", {
                        booking_id: item.id
                    })
                }>
                    <View style={styles.row}>
                        <Text style={styles.serviceType}>{item.service_type}</Text>
                        <Text style={styles.price}>P{item.total_price ?? "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.customerName}>
                            <Text>
                                {item.mechanics.first_name} {item.mechanics.last_name}
                            </Text>
                        </Text>
                        <Text style={getStatusStyle(item.status)}>{item.status}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text style={styles.date}>{moment(item.created_at).format("LLL")}</Text>
                        <Text style={styles.paymentMethod}>
                            Payment Method: {item.mode_of_payment}
                        </Text>
                    </View>
                </View>

            </Card>
        )
    };
    return (
        <View style={styles.container}>
            <Loading loading={loading} />
            <Text style={styles.heading}>Favorite Mechanics</Text>
            <Text style={styles.subtitle}>See your previous bookings with your favorite mechanics and rebook!</Text>
            {favoriteBookings.length > 0 ? (
                <FlatList
                    data={favoriteBookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Card style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Book now to access your logs!</Text>
                </Card>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
    },
    heading: {
        fontFamily: "Nunito-Bold",
        marginBottom: 10,
        fontSize: 24, // Adjust the size for emphasis
        textAlign: "center", // Center the header
    },
    subtitle: {
        fontFamily: "Nunito-Light",
        marginBottom: 10,
        fontSize: 15, // Adjust the size for emphasis
        textAlign: "center", // Center the header
    },
    listContent: {
        paddingBottom: 10,
    },
    card: {
        width: "100%",
        marginBottom: 10,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    serviceType: {
        fontFamily: "Nunito-Bold",
        color: "black",
        fontSize: 16,
    },
    price: {
        fontFamily: "Nunito-Bold",
        color: "black",
        fontSize: 16,
    },
    customerName: {
        fontFamily: "Nunito-Light",
        color: "black",
        fontSize: 14,
    },
    status: {
        fontFamily: "Nunito-Bold",
        fontSize: 14,
        paddingHorizontal: 10, // Add horizontal padding
        paddingVertical: 5,    // Add vertical padding
        borderRadius: 5,      // Add border radius
        overflow: "hidden",    // Ensure the border radius is applied
    },
    statusCompleted: {
        backgroundColor: "green",
        color: "white",
    },
    statusAccepted: {
        backgroundColor: "#FFC107",
        color: "white",
    },
    statusPending: {
        backgroundColor: "orange",
        color: "white",
    },
    statusCancelled: {
        backgroundColor: "red",
        color: "white",
    },
    statusDefault: {
        backgroundColor: "gray",
        color: "white",
    },
    date: {
        fontFamily: "Nunito-Light",
        color: "black",
        fontSize: 12,
    },
    paymentMethod: {
        fontFamily: "Nunito-Light",
        color: "black",
        fontSize: 12,
    },
    emptyCard: {
        width: "100%",
        padding: 15,
    },
    emptyText: {
        fontFamily: "Nunito-Light",
        color: "black",
    },
});

export default FavoriteMechanic;