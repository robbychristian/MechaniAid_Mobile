import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const WelcomePage = () => {
  const navigation = useNavigation();
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

export default WelcomePage;
