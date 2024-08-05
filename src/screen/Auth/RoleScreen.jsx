import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

const RoleScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* <div></div> == <View></View> */}
      <View style={{ width: "90%", alignItems: "flex-start" }}>
        <Text style={{ color: "#464646", fontFamily: "Nunito-Bold", fontSize: 40 }}>Identify yourself</Text>
        <Text style={{ color: "#616161", fontFamily: "Nunito-Light", fontSize: 18 }}>What type suits you?</Text>
      </View>
      <Image
        source={require("../../../assets/mechanics.png")}
        style={{ width: 375, height: 390 }}
      />
      
      <View style={{ width: "90%", marginTop: 20, alignItems: "center" }}>
        <Button
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("MechanicRegister")}
        >
          {() => <Text style={styles.textStyle}>MECHANIC</Text>}
        </Button>
        <Button
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Register")}
        >
          {() => <Text style={styles.textStyle}>CUSTOMER</Text>}
        </Button>
        <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
                marginTop: 5,
              }}
            >
              <Text>
                Already have an account?{" "}
                <Text
                  style={{ textDecorationLine: "underline" }}
                >
                  Login Here!
                </Text>
              </Text>
            </TouchableOpacity>
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "#8e8888", fontFamily: "Nunito-Bold", fontSize: 15 }}>Developed by Data X 2024</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: "center", 
    alignItems: "center", 
    flex: 1 
  },
  buttonStyle: {
    width: "80%",
    marginVertical: 10,
    borderColor: "#EF4141",
    backgroundColor: "#EF4141",
    borderRadius: 20,
    paddingVertical: 15,
  },
  textStyle: { fontFamily: "Nunito-Bold",  
    fontSize: 20, 
    color: "#fff" 
  },
});

export default RoleScreen;
