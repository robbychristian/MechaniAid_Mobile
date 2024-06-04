import { Button, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import * as DocumentPicker from "expo-document-picker";
import { Toast } from "toastify-react-native";
import { registerUser } from "../../store/auth/User";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import moment from "moment";

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [fileUpload, setFileUpload] = useState(null);
  const [displayFileUpload, setDisplayFileUpload] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    const formdata = new FormData();
    const newFile = {
      uri: fileUpload.uri,
      type: "multipart/form-data",
      name: fileUpload.name,
    };
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formdata.append(key, data[key]);
      }
    }
    formdata.append("customers_profile_pic", newFile);
    try {
      const response = await dispatch(registerUser(formdata));
      if (response.type == "auth/register/fulfilled") {
        Toast.success("Account has been registered!");
        navigation.navigate("Login");
      } else {
        Toast.error("There was an error registering your account");
      }
    } catch (err) {
      console.log(err);
      Toast.error("There was an error registering your account");
    }
  };

  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    setFileUpload(result.assets[0]);
    setDisplayFileUpload(result.assets[0].uri);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#A02828",
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            <Text category="h4" style={{ color: "#fff" }}>
              Register As Customer!
            </Text>
            <Text category="p2" style={{ color: "#fff" }} appearance="hint">
              By creating your account, you agree to the terms and condition of
              our application!
            </Text>
          </View>
          <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                onPress={uploadFile}
                style={{
                  backgroundColor: "#ddd",
                  height: 200,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                }}
              >
                {fileUpload !== null ? (
                  <Image
                    source={{ uri: displayFileUpload }}
                    style={{ height: "100%", width: "100%", borderRadius: 100 }}
                  />
                ) : (
                  <Text>Upload Photo Here</Text>
                )}
              </TouchableOpacity>
            </View>
            <CustomTextInput
              control={control}
              errors={errors}
              label={`First Name`}
              message={`First name is required`}
              my={5}
              name={`fname`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Middle Name`}
              message={`Middle name is required`}
              my={5}
              name={`mname`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Last Name`}
              message={`Last name is required`}
              my={5}
              name={`lname`}
              rules={{ required: true }}
            />
            <CustomDatePicker
              control={control}
              errors={errors}
              label={`Birthday`}
              message={`Birthday is required`}
              my={5}
              name={`bday`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Region`}
              message={`Region is required`}
              my={5}
              name={`region`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`State`}
              message={`State is required`}
              my={5}
              name={`state`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`City`}
              message={`City is required`}
              my={5}
              name={`city`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Barangay`}
              message={`Barangay is required`}
              my={5}
              name={`barangay`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Street`}
              message={`Street is required`}
              my={5}
              name={`street`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Email`}
              message={`Email is required`}
              my={5}
              name={`email`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Password`}
              message={`Password is required`}
              my={5}
              name={`pwd`}
              rules={{ required: true }}
              secureTextEntry
            />
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Confirm Password`}
              message={`Confirm Password is required`}
              my={5}
              name={`confpw`}
              rules={{ required: true }}
              secureTextEntry
            />

            <Button
              style={{
                marginTop: 10,
                backgroundColor: "#A02828",
                borderColor: "#A02828",
              }}
              onPress={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
