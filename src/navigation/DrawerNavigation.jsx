import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import Home from "../screen/Home";
import { useDispatch } from "react-redux";
import { Drawer, DrawerItem, IndexPath } from "@ui-kitten/components";

const DrawerStack = createDrawerNavigator();

const DrawerContent = ({ navigation, state }) => {
  const dispatch = useDispatch();
  return (
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index.row]);
        if (index != 6) {
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
      <DrawerStack.Screen name="Home" component={Home} />
      {/* <DrawerStack.Screen
        name="Services"
        component={Services}
        options={{ headerTitle: "SERVICES", headerTitleAlign: "center" }}
    /> */}
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;
