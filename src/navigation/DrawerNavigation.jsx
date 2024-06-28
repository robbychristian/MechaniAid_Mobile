import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import Home from "../screen/Home";
import { useDispatch } from "react-redux";
import { Drawer, DrawerItem, IndexPath } from "@ui-kitten/components";
import BottomNav from '../navigation/BottomNavigation'
import Product from "../screen/Market/Product";
import Chat from "../screen/Chat/Chat";
import AcceptBooking from "../screen/Booking/AcceptBooking";
import Payment from "../screen/Payment/Payment";
import BookingDetails from "../screen/Booking/BookingDetails";
import BookingPayment from "../screen/Payment/BookingPayment";

const DrawerStack = createDrawerNavigator();

const DrawerContent = ({ navigation, state }) => {
  const dispatch = useDispatch();
  return (
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => {
        if (index != 2) {
          navigation.navigate(state.routeNames[index.row]);
        }
      }}
      style={{ marginTop: 50 }}
    >
      <DrawerItem title={`Home`} />
      <DrawerItem
        title={`Logout`}
        onPress={async () => {
          navigation.navigate("Login");
          await dispatch(logout());
        }}
      />
    </Drawer>
  );
};

const DrawerNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <DrawerStack.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#A02828",
        },
        headerTitleStyle: {
          color: "#fff",
        },
        headerTintColor: "#fff",
        headerTitle: "MECHANI-AID",
        headerTitleAlign: "center",
      }}
    >
      <DrawerStack.Screen name="BottomNav" component={BottomNav} />
      <DrawerStack.Screen name="Product" component={Product} />
      <DrawerStack.Screen name="Chat" component={Chat} />
      <DrawerStack.Screen name="AcceptBooking" component={AcceptBooking} />
      <DrawerStack.Screen name="Payment" component={Payment} />
      <DrawerStack.Screen name="BookingDetails" component={BookingDetails} />
      <DrawerStack.Screen name="BookingPayment" component={BookingPayment} />
      {/* <DrawerStack.Screen
        name="Services"
        component={Services}
        options={{ headerTitle: "SERVICES", headerTitleAlign: "center" }}
    /> */}
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;
