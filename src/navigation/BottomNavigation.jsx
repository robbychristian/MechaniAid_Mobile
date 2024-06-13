import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Home from '../screen/Home';
import Booking from '../screen/Booking/Booking';
import ProductList from '../screen/Market/ProductList';

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home'},
    { key: 'market', title: 'Market', focusedIcon: 'cart' },
    { key: 'chat', title: 'Chat', focusedIcon: 'chat' },
    { key: 'booking', title: 'Booking', focusedIcon: 'car-side', unfocusedIcon: 'car-side' },
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
      inactiveColor='#000'
      activeColor='#fff'
      theme={{ colors: {secondaryContainer: "#A02828"} }}
    />
  );
};

export default BottomNav;