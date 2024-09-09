import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../store/auth/User";

const WelcomePage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt_token");
        const userInfoString = await AsyncStorage.getItem("user_info");

        if (token && userInfoString) {
          const userInfo = JSON.parse(userInfoString); // Parse only if we have the string
          console.log("User Info: ", userInfo);
          dispatch(setUser(userInfo));

          // Parsing in the if-else directly
          userInfo.user_role === "3"
            ? navigation.navigate("DrawerStack")
            : userInfo.user_role === "2" &&
              navigation.navigate("MechanicDrawerStack");
        } else {
          console.log("No token and user info retrieved");
        }
      } catch (err) {
        console.log("Error checking login status:", err);
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      {/* <div></div> == <View></View> */}
      <Image
        source={require("../../assets/MechaniAid-Logo.png")}
        style={{ width: 370, height: 186 }}
      />

      <View style={{ width: "90%", marginTop: 160, alignItems: "center" }}>
        <Button
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Login")}
        >
          {() => <Text style={styles.textStyle}>LOGIN</Text>}
        </Button>
        <Button
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("RoleScreen")}
        >
          {() => <Text style={styles.textStyle}>REGISTER</Text>}
        </Button>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              color: "#8e8888",
              fontFamily: "Nunito-Bold",
              fontSize: 15,
            }}
          >
            Developed by Data X 2024
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonStyle: {
    width: "80%",
    marginVertical: 10,
    borderColor: "#EF4141",
    backgroundColor: "#EF4141",
    borderRadius: 20,
    paddingVertical: 15,
  },
  textStyle: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#fff",
  },
});

export default WelcomePage;
