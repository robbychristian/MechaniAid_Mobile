import * as React from "react";
import { BottomNavigation, Icon, Text } from "react-native-paper";
import Home from "../screen/Home";
import Booking from "../screen/Booking/Booking";
import ProductList from "../screen/Market/ProductList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatList from "../screen/Chat/ChatList";
import BookingDetails from "../screen/Booking/BookingDetails";

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
      title: "Booking",
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
    <BottomTab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          // case 'Home':
          //   iconName = 'home';
          //   break;
          case 'Market':
            iconName = 'shopping-cart';
            break;
          case 'ChatList':
            iconName = 'chat';
            break;
          case 'Booking':
            iconName = 'directions-car';
            break;
          default:
            iconName = 'circle';
            break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#000',
      tabBarStyle: {
        backgroundColor: '#A02828',
        borderTopWidth: 0,
        paddingBottom: 10,
        height: 60
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
      },
    })}>
      <BottomTab.Screen name="Home" component={Home} />
      <BottomTab.Screen name="Market" component={ProductList} />
      <BottomTab.Screen name="ChatList" component={ChatList} options={{ tabBarLabel: "Chat" }} />
      <BottomTab.Screen name="BookingDetails" component={BookingDetails} options={{ tabBarLabel: "Booking" }} />
    </BottomTab.Navigator>
  );
};

export default BottomNav;
