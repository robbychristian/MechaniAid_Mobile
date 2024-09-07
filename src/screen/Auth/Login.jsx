import { Button, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Image, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import { loginUser } from "../../store/auth/User";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const inputs = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await dispatch(loginUser(inputs));
      if (response.payload == "error") {
        Toast.error("User does not exist!")
      } else if (response.payload.success) {
        const { token, user } = response.payload;
        if (token) {
          await AsyncStorage.setItem('jwt_token', token)
          await AsyncStorage.setItem('user_info', JSON.stringify(user)); // Store user info
          Toast.success("Logged in successfully!");
          if (user.user_role == 3) {
            navigation.navigate("DrawerStack");
            // navigation.dispatch(
            //   CommonActions.reset({
            //     index: 0,
            //     routes: [{ name: "DrawerStack" }],
            //   })
            // );
          }
          else if (user.user_role == 2) {
            navigation.navigate("MechanicDrawerStack");
            // navigation.dispatch(
            //   CommonActions.reset({
            //     index: 0,
            //     routes: [{ name: "MechanicDrawerStack" }],
            //   })
            // );
          }
          console.log('User Role:', user?.user_role);
          console.log('Navigating to:', user?.user_role === 3 ? 'DrawerStack' : 'MechanicDrawerStack');                    

        } else {
          console.log("Token is undefined, not saving to AsyncStorage.");
        }
      } else {
        Toast.error("User does not exist!");
      }
      // if (response.payload.success) {
      //   const token = response.token;
      //   await AsyncStorage.setItem('jwt_token', token)
      //   Toast.success("Logged in successfully!");
      //   navigation.navigate("DrawerStack");
      // } else {
      //   Toast.error("User does not exist!");
      // }
      // if (response.payload == "error") {
      //   Toast.error("User does not exist!");
      // } else {
      //   Toast.success("Logged in successfully!");
      //   navigation.navigate("DrawerStack");
      // }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={styles.container}
    >
      <Loading loading={loading} />
      <Image
        source={require("../../../assets/MechaniAid-Logo.png")}
        style={{ width: 370, height: 186 }}
      />
      <View style={{ width: "80%", marginTop: 70 }}>
        {/* <input type='text' name='email' required> */}
        <CustomTextInput
          control={control}
          errors={errors}
          label={`Email`}
          name={"email"}
          rules={{ required: true }}
          message={`Email is required!`}
          my={5}
        />
        {/* <input type='password' name='email' required> */}
        <CustomTextInput
          control={control}
          errors={errors}
          label={`Password`}
          name={"password"}
          rules={{ required: true }}
          message={`Password is required!`}
          my={5}
          secureTextEntry={true}
        />
        <Button
          appearance="filled"
          style={styles.buttonStyle}
          onPress={handleSubmit(onSubmit)}
        >
          {() => <Text style={styles.textStyle}>LOGIN</Text>}
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RoleScreen");
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
            marginTop: 5,
          }}
        >
          <Text>
            Don't have an account yet?{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
            >
              Register Here!
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "#8e8888", fontFamily: "Nunito-Bold", fontSize: 15 }}>Developed by Data X 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 50,
    borderColor: "#EF4141",
    backgroundColor: "#EF4141",
    borderRadius: 20,
    paddingVertical: 15,
  },
  textStyle: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#fff"
  },
});
export default Login;
