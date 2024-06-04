import { useNavigation } from "@react-navigation/native";
import { Button } from "@ui-kitten/components";
import React from "react";
import { View, Text } from "react-native";

const WelcomePage = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <View style={{ width: "90%", marginTop: 250 }}>
        <Button
          style={{ marginVertical: 10, backgroundColor: "#A02828" }}
          onPress={() => navigation.navigate("Login")}
        >
          LOGIN
        </Button>
        <Button
          style={{ marginVertical: 10, backgroundColor: "#A02828" }}
          onPress={() => navigation.navigate("Register")}
        >
          REGISTER
        </Button>
      </View>
    </View>
  );
};

export default WelcomePage;
