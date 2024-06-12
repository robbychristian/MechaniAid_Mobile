import { Button, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import { loginUser } from "../../store/auth/User";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";

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
        Toast.error("User does not exist!");
      } else {
        Toast.success("Logged in successfully!");
        navigation.navigate("DrawerStack");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading loading={loading} />
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
      <View style={{ width: "80%" }}>
        <CustomTextInput
          control={control}
          errors={errors}
          label={`Email`}
          name={"email"}
          rules={{ required: true }}
          message={`Email is required!`}
          my={5}
        />
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
          style={{
            backgroundColor: "#A02828",
            borderColor: "#A02828",
            marginTop: 15,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          LOGIN
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Register");
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text category="label">
            Don't have an account yet?{" "}
            <Text category="label" style={{ textDecorationLine: "underline" }}>
              Register Here!
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
