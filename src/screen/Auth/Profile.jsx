import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import { updateAddressInformation, updatePersonalInformation } from "../../store/auth/User";
import { Toast } from "toastify-react-native";
import moment from "moment";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const [fileUpload, setFileUpload] = useState(null);
  const [displayFileUpload, setDisplayFileUpload] = useState(null);
  const {
    control: controlPersonal,
    handleSubmit: handleSubmitPersonal,
    formState: { errors: errorsPersonal },
  } = useForm({ defaultValues: {} });

  const {
    control: controlAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
  } = useForm({ defaultValues: {} });

  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    setFileUpload(result.assets[0]);
    setDisplayFileUpload(result.assets[0].uri);
  };

  const onUpdatePersonal = async (data) => {
    const formdata = new FormData()
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (key == 'bday') {
                formdata.append(key, moment(data[key]).format("YYYY-MM-DD"))
            } else {
                formdata.append(key, data[key])
            }
        }
    }
    formdata.append('id', user.id)
    formdata.append('user_role', user.user_role)
    try {
        const response = await dispatch(updatePersonalInformation(formdata));
        if (response.type == "auth/updatepersonalinformation/fulfilled") {
            console.log(response)
            Toast.success("Personal Information has been updated")
        } else {
            Toast.error("There was an error updating your account!")
        }
    } catch (err) {
        console.log(err)
        Toast.error("There was a problem updating your account")
    }
  }
  
  const onUpdateAddress = async (data) => {
    // console.log(data)
    const formdata = new FormData()
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formdata.append(key, data[key])
        }
    }
    formdata.append('id', user.id)
    formdata.append('user_role', user.user_role)
    try {
        // console.log(formdata)
        const response = await dispatch(updateAddressInformation(formdata))
        if (response.type == "auth/updateaddressinformation/fulfilled") {
            Toast.success('Address Information has been updated')
        } else {
            Toast.error("There was an error updating your account!")
        }
    } catch (err) {
        console.log(err)
        Toast.error("There was a problem updating your account!")
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{ fontSize: 30, fontWeight: "bold", color: "#EF4141" }}
            >
              Edit your profile!
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
                  <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 20 }}>
                    Upload file here
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 30,
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Personal Information
            </Text>
            <CustomTextInput
              control={controlPersonal}
              errors={errorsPersonal}
              label={`First Name`}
              message={`First name is required`}
              my={5}
              name={`fname`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlPersonal}
              errors={errorsPersonal}
              label={`Middle Name`}
              message={`Middle name is required`}
              my={5}
              name={`mname`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlPersonal}
              errors={errorsPersonal}
              label={`Last Name`}
              message={`Last name is required`}
              my={5}
              name={`lname`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlPersonal}
              errors={errorsPersonal}
              label={`Contact No.`}
              message={`Contact Number is required`}
              my={5}
              name={`phone`}
              rules={{ required: true }}
            />
            <CustomDatePicker
              control={controlPersonal}
              errors={errorsPersonal}
              label={`Birthday`}
              message={`Birthday is required`}
              my={5}
              name={`bday`}
              rules={{ required: true }}
            />
            <View style={{ marginVertical: 15 }}>
              <Button
                onPress={handleSubmitPersonal(onUpdatePersonal)}
                style={{ backgroundColor: "#EF4141", borderColor: "#EF4141" }}
              >
                Update Personal Information
              </Button>
            </View>
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 30,
                marginBottom: 5,
              }}
            >
              Address Information
            </Text>
            <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`Region`}
              message={`Region is required`}
              my={5}
              name={`region`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`State`}
              message={`State is required`}
              my={5}
              name={`state`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`City`}
              message={`City is required`}
              my={5}
              name={`city`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`Barangay`}
              message={`Barangay is required`}
              my={5}
              name={`barangay`}
              rules={{ required: true }}
            />
            <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`Street`}
              message={`Street is required`}
              my={5}
              name={`street`}
              rules={{ required: true }}
            />
            <View style={{ marginVertical: 15 }}>
              <Button
                onPress={handleSubmitAddress(onUpdateAddress)}
                style={{ backgroundColor: "#EF4141", borderColor: "#EF4141" }}
              >
                Update Address Information
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
