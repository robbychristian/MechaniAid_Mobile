import React from "react";
import { Image } from "react-native";
import { BottomNavigation, Icon, Text } from "react-native-paper";
import Home from "../screen/Home";
import Booking from "../screen/Booking/Booking";
import ProductList from "../screen/Market/ProductList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatList from "../screen/Chat/ChatList";
import BookingHistory from "../screen/Booking/BookingHistory";


// Import custom icons
import HomeIcon from "../../assets/home.png";
import MarketIcon from "../../assets/trolley.png";
import ChatIcon from "../../assets/chat.png";
import HistoryIcon from "../../assets/history.png";

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const BottomTab = createBottomTabNavigator();

const CustomTabBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home" },
    { key: "market", title: "Market", focusedIcon: "cart" },
    { key: "chat", title: "Chat", focusedIcon: "chat" },
    {
      key: "booking",
      title: "History",
      focusedIcon: "car-side",
      unfocusedIcon: "car-side",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    market: ProductList,
    chat: RecentsRoute,
    booking: Booking,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: "#A02828" }}
      inactiveColor="#000"
      activeColor="#fff"
      theme={{ colors: { secondaryContainer: "#A02828" } }}
    />
  );
};

const BottomNav = () => {
  return (
    <BottomTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconSource;

        switch (route.name) {
          case "Home":
            iconSource = HomeIcon;
            break;
          case "Market":
            iconSource = MarketIcon;
            break;
          case "ChatList":
            iconSource = ChatIcon;
            break;
          case "BookingHistory":
            iconSource = HistoryIcon;
            break;
          default:
            iconSource = null;
            break;
        }

        return (
          <Image
            source={iconSource}
            style={{ width: size, height: size, tintColor: color }}
          />
        );
      },
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#000",
      tabBarStyle: {
        backgroundColor: "#EF4444",
        borderTopWidth: 0,
        paddingBottom: 10,
        height: 65,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontFamily: "Nunito-Bold",
      },
    })}
  >
    <BottomTab.Screen name="Home" component={Home} />
    <BottomTab.Screen name="Market" component={ProductList} />
    <BottomTab.Screen
      name="ChatList"
      component={ChatList}
      options={{ tabBarLabel: "Chat" }}
    />
    <BottomTab.Screen
      name="BookingHistory"
      component={BookingHistory}
      options={{ tabBarLabel: "History" }}
    />
  </BottomTab.Navigator>
  );
};

export default BottomNav;
