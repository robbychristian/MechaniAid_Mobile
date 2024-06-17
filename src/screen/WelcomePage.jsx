import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

const WelcomePage = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", flex: 1}}
    >
      <View
        style={{
          height: 300,
          width: 300,
          backgroundColor: "#A02828",
          borderRadius: 1000,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text category="h1" style={{ color: "#fff" }}>
          Mechani-Aid
        </Text>
      </View>
      <View style={{ width: "90%", marginTop: 100 }}>
        <Button
          style={{ marginVertical: 10, borderColor: "#A02828", backgroundColor: "#A02828" }}
          onPress={() => navigation.navigate("Login")}
        >
          LOGIN
        </Button>
        <Button
          style={{ marginVertical: 10, borderColor: "#A02828", backgroundColor: "#A02828" }}
          onPress={() => navigation.navigate("Register")}
        >
          REGISTER
        </Button>
      </View>
    </View>
  );
};

export default WelcomePage;
