import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import {
  updateAddressInformation,
  updatePersonalInformation,
} from "../../store/auth/User";
import { Toast } from "toastify-react-native";
import moment from "moment";
import { CustomSelect } from "../../components/Inputs/CustomSelect";
import axios from "axios";

const Profile = ( {handleLogout}) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const [fileUpload, setFileUpload] = useState(null);
  const [displayFileUpload, setDisplayFileUpload] = useState(null);
  const {
    control: controlPersonal,
    handleSubmit: handleSubmitPersonal,
    formState: { errors: errorsPersonal },
    setValue,
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
    const formdata = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == "bday") {
          formdata.append(key, moment(data[key]).format("YYYY-MM-DD"));
        } else {
          formdata.append(key, data[key]);
        }
      }
    }
    formdata.append("id", user.id);
    formdata.append("user_role", user.user_role);
    try {
      const response = await dispatch(updatePersonalInformation(formdata));
      if (response.type == "auth/updatepersonalinformation/fulfilled") {
        console.log(response);
        Toast.success("Personal Information has been updated");
      } else {
        Toast.error("There was an error updating your account!");
      }
    } catch (err) {
      console.log(err);
      Toast.error("There was a problem updating your account");
    }
  };

  const onUpdateAddress = async (data) => {
    console.log(data)
    const formdata = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formdata.append(key, data[key]);
      }
    }
    formdata.append("id", user.id);
    formdata.append("user_role", user.user_role);

    formdata.append("region", selectedRegion?.region_name || "");
    formdata.append("state", selectedProvince?.province_name || "");
    formdata.append("city", selectedCity?.city_name || "");
    formdata.append("barangay", selectedBarangay?.brgy_name || "");

    try {
      // console.log(formdata)
      const response = await dispatch(updateAddressInformation(formdata));
      if (response.type == "auth/updateaddressinformation/fulfilled") {
        Toast.success("Address Information has been updated");
      } else {
        Toast.error("There was an error updating your account!");
      }
    } catch (err) {
      console.log(err);
      Toast.error("There was a problem updating your account!");
    }
  };
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  useEffect(() => {
    axios
      .get("https://isaacdarcilla.github.io/philippine-addresses/region.json")
      .then((response) => setRegions(response.data));
  }, []);

  // useEffect(() => {
  //   if (selectedRegion) {
  //     axios
  //       .get(
  //         "https://isaacdarcilla.github.io/philippine-addresses/province.json"
  //       )
  //       .then((response) =>
  //         setProvinces(
  //           response.data.filter(
  //             (p) => p.region_code === selectedRegion.region_code
  //           )
  //         )
  //       );
  //     setSelectedProvince(null); // Reset selected province
  //     setSelectedCity(null); // Reset selected city
  //     setSelectedBarangay(null); // Reset selected barangay
  //   } else {
  //     setProvinces([]);
  //   }
  // }, [selectedRegion]);

  // useEffect(() => {
  //   if (selectedProvince) {
  //     axios
  //       .get("https://isaacdarcilla.github.io/philippine-addresses/city.json")
  //       .then((response) =>
  //         setCities(
  //           response.data.filter(
  //             (c) => c.province_code === selectedProvince.province_code
  //           )
  //         )
  //       );
  //     setSelectedCity(null); // Reset selected city
  //     setSelectedBarangay(null); // Reset selected barangay
  //   } else {
  //     setCities([]);
  //   }
  // }, [selectedProvince]);

  // useEffect(() => {
  //   if (selectedCity) {
  //     axios
  //       .get(
  //         "https://isaacdarcilla.github.io/philippine-addresses/barangay.json"
  //       )
  //       .then((response) =>
  //         setBarangays(
  //           response.data.filter((b) => b.city_code === selectedCity.city_code)
  //         )
  //       );
  //     setSelectedBarangay(null); // Reset selected barangay
  //   } else {
  //     setBarangays([]);
  //   }
  // }, [selectedCity]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (user) {
        setValue("fname", user.first_name || "");
        setValue("mname", user.middle_name || "");
        setValue("lname", user.last_name || "");
        setValue(
          "phone",
          user.user_role === 3
            ? user.customers?.phone || ""
            : user.mechanics?.phone || ""
        );
      } else {
        // If user is undefined, reset form fields
        setValue("fname", "");
        setValue("mname", "");
        setValue("lname", "");
        setValue("phone", "");
      }
    });
  
    // Initial setting of values if user is defined
    if (user) {
      setValue("fname", user.first_name || "");
      setValue("mname", user.middle_name || "");
      setValue("lname", user.last_name || "");
      let phoneInput = "";
      if(user.user_role == 3){
        phoneInput = user.customers.phone;
      } else if (user.user_role == 2){
        phoneInput = user.mechanics.phone;
      }
      setValue(
        "phone",
        user.user_role === 3
          ? user.customers?.phone || ""
          : user.mechanics?.phone || ""
      );
    } else {
      // If user is undefined, reset form fields
      setValue("fname", "");
      setValue("mname", "");
      setValue("lname", "");
      setValue("phone", "");
    }
  
    return unsubscribe;
  }, [navigation, user]);
  

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              justifyContent: "left",
              alignSelf: "flex-start",
              paddingVertical: 15,
              paddingHorizontal: 15,
            }}
          >
            <Text style={styles.title}>Edit Profile</Text>
            {/* <Text style={styles.subtitle}></Text> */}
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
                style={styles.buttonStyle}
              >
                {() => (
                  <Text style={styles.textStyle}>
                    Update Personal Information
                  </Text>
                )}
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
            <CustomSelect
              control={controlAddress}
              errors={errorsAddress}
              my={5}
              label="Region"
              // placeholder={user.user_role == 3 ? user.customers.region : user.mechanics.region}
              placeholder="Select Region"
              options={regions.map((region) => ({
                value: region.region_name,
                ...region,
              }))}
              value={selectedRegion}
              setValue={setSelectedRegion}
            />
            <CustomSelect
              control={controlAddress}
              errors={errorsAddress}
              my={5}
              label="Province"
              placeholder={user.user_role == 3 ? user.customers?.state : user.mechanics?.state}
              options={provinces.map((province) => ({
                value: province.province_name,
                ...province,
              }))}
              value={selectedProvince}
              setValue={setSelectedProvince}
              disabled={!selectedRegion}
            />
            <CustomSelect
              control={controlAddress}
              errors={errorsAddress}
              my={5}
              label="City"
              placeholder={user.user_role == 3 ? user.customers?.city : user.mechanics?.city}
              options={cities.map((city) => ({
                value: city.city_name,
                ...city,
              }))}
              value={selectedCity}
              setValue={setSelectedCity}
              disabled={!selectedProvince}
            />
            <CustomSelect
              control={controlAddress}
              errors={errorsAddress}
              my={5}
              label="Barangay"
              placeholder={user.user_role == 3 ? user.customers?.barangay : user.mechanics?.barangay}
              options={barangays.map((barangay) => ({
                value: barangay.brgy_name,
                ...barangay,
              }))}
              value={selectedBarangay}
              setValue={setSelectedBarangay}
              disabled={!selectedCity}
            />
            <CustomTextInput
              control={controlPersonal}
              errors={errorsPersonal}
              label={`Street`}
              message={`Street is required`}
              my={5}
              name={`street`}
              rules={{ required: true }}
            /> 
             {/* <CustomTextInput
              control={controlAddress}
              errors={errorsAddress}
              label={`Street`}
              message={`Street is required`}
              my={5}
              name={`street`}
              rules={{ required: true }}
            /> */}

            <View style={{ marginVertical: 15 }}>
              <Button
                onPress={handleSubmitAddress(onUpdateAddress)}
                style={styles.buttonStyle}
              >
                {() => (
                  <Text style={styles.textStyle}>
                    Update Address Information
                  </Text>
                )}
              </Button>
              <Button
                onPress={handleLogout}
                style={styles.buttonStyle}
              >
                {() => (
                  <Text style={styles.textStyle}>
                    LOGOUT
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    color: "#EF4141",
  },
  subtitle: {
    fontFamily: "Nunito-Light",
    fontSize: 15,
    marginLeft: 2,
  },
  buttonStyle: {
    width: "80%",
    alignSelf: "center",
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

export default Profile;
