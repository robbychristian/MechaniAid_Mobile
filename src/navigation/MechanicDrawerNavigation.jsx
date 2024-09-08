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
import BookingPayment from "../screen/Payment/BookingPayment";
import BookingHistory from "../screen/Booking/BookingHistory";
import Booking from "../screen/Booking/Booking";
import Profile from "../screen/Auth/Profile";
import AddProduct from "../screen/Market/AddProduct";
import EditProduct from "../screen/Market/EditProduct";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../store/auth/User";
import RebookRequests from "../screen/Booking/RebookRequests";
import BookingInfo from "../screen/Booking/BookingInfo";

const DrawerStack = createDrawerNavigator();

const DrawerContent = ({ navigation, state, handleLogout }) => {
  const dispatch = useDispatch();
  return (
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => {
        if (index != 3) {
          navigation.navigate(state.routeNames[index.row]);
        }
      }}
      style={{ marginTop: 50 }}
    >
      <DrawerItem title={`Home`} />
      <DrawerItem title={`Profile`} />
      <DrawerItem
        title={`Logout`}
        onPress={async () => {
          navigation.navigate("Login");
          await dispatch(logout());

          try {
            await AsyncStorage.removeItem('jwt_token');
            await AsyncStorage.removeItem('user_info');

            await dispatch(logoutUser());
            navigation.navigate("Login")
          } catch (error) {
            console.log('Error during logout:', error)
          }
        }}
      />
    </Drawer>
  );
};

const MechanicDrawerNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('user_info');
      await dispatch(logoutUser());
      navigation.navigate("Login");
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <DrawerStack.Navigator
      drawerContent={(props) => <DrawerContent {...props} handleLogout={handleLogout} />}
      screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: "#EF4444",
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
      <DrawerStack.Screen name="Profile">
        {(props) => <Profile {...props} handleLogout={handleLogout} />}
      </DrawerStack.Screen>
      <DrawerStack.Screen name="Product" component={Product} />
      <DrawerStack.Screen name="Chat" component={Chat} />
      <DrawerStack.Screen name="Booking" component={Booking} />
      <DrawerStack.Screen name="AcceptBooking" component={AcceptBooking} />
      <DrawerStack.Screen name="BookingPayment" component={BookingPayment} />
      <DrawerStack.Screen name="Payment" component={Payment} />
      <DrawerStack.Screen name="BookingHistory" component={BookingHistory} />
      <DrawerStack.Screen name="AddProduct" component={AddProduct} />
      <DrawerStack.Screen name="EditProduct" component={EditProduct} />
      <DrawerStack.Screen name="RebookRequests" component={RebookRequests} />
      <DrawerStack.Screen name="BookingInfo" component={BookingInfo} />
      
    </DrawerStack.Navigator>
  );
};

export default MechanicDrawerNavigation;
