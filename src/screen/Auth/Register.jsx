import { Button, Text } from "@ui-kitten/components";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import * as DocumentPicker from "expo-document-picker";
import { Toast } from "toastify-react-native";
import { registerUser } from "../../store/auth/User";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import moment from "moment";
import { IconButton } from "react-native-paper";
import Loading from '../../components/Loading'
import CustomPhoneInput from "../../components/Inputs/CustomPhoneInput";
import { CustomSelect } from "../../components/Inputs/CustomSelect";
import axios from 'axios'

const Register = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth)
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [fileUpload, setFileUpload] = useState(null);
  const [displayFileUpload, setDisplayFileUpload] = useState(null);

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

  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(
          "https://isaacdarcilla.github.io/philippine-addresses/province.json"
        )
        .then((response) =>
          setProvinces(
            response.data.filter(
              (p) => p.region_code === selectedRegion.region_code
            )
          )
        );
      setSelectedProvince(null); // Reset selected province
      setSelectedCity(null); // Reset selected city
      setSelectedBarangay(null); // Reset selected barangay
    } else {
      setProvinces([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get("https://isaacdarcilla.github.io/philippine-addresses/city.json")
        .then((response) =>
          setCities(
            response.data.filter(
              (c) => c.province_code === selectedProvince.province_code
            )
          )
        );
      setSelectedCity(null); // Reset selected city
      setSelectedBarangay(null); // Reset selected barangay
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      axios
        .get(
          "https://isaacdarcilla.github.io/philippine-addresses/barangay.json"
        )
        .then((response) =>
          setBarangays(
            response.data.filter((b) => b.city_code === selectedCity.city_code)
          )
        );
      setSelectedBarangay(null); // Reset selected barangay
    } else {
      setBarangays([]);
    }
  }, [selectedCity]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    const formdata = new FormData();
    const newFile = {
      uri: fileUpload.uri,
      type: "multipart/form-data",
      name: fileUpload.name,
    };
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == "bday") {
          formdata.append(key, moment(data[key]).format("YYYY-MM-DD"));
        } else {
          formdata.append(key, data[key]);
        }
      }
    }
    formdata.append("customers_profile_pic", newFile);

    formdata.append("region", selectedRegion?.region_name || "");
    formdata.append("state", selectedProvince?.province_name || "");
    formdata.append("city", selectedCity?.city_name || "");
    formdata.append("barangay", selectedBarangay?.brgy_name || "");

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
      <Loading loading={loading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#EF4141",
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            <Text  style={{ fontFamily: "Nunito-Bold", fontSize: 30, color: "#fff" }}>
              Register As Customer!
            </Text>
            <Text style={{ fontFamily: "Nunito-Regular", fontSize: 15, color: "#fff" }} appearance="hint">
              You will be able to access the features of our app after
              registration!
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
                  <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 20 }}>Upload Photo Here</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={styles.title}
            >
              Personal Information
            </Text>
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
             <CustomPhoneInput
              control={control}
              errors={errors}
              label={`Phone No.`}
              message={`Mobile Number is required`}
              my={5}
              name={`phone`}
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
            <Text
              style={styles.title}
            >
              Address Information
            </Text>
            <CustomSelect
              my={5}
              label="Region"
              placeholder="Select Region"
              options={regions.map((region) => ({
                value: region.region_name,
                ...region,
              }))}
              value={selectedRegion}
              setValue={setSelectedRegion}
              name={`region`}
            />
            <CustomSelect
              my={5}
              label="Province"
              placeholder="Select Province"
              options={provinces.map((province) => ({
                value: province.province_name,
                ...province,
              }))}
              value={selectedProvince}
              setValue={setSelectedProvince}
              disabled={!selectedRegion}
              name={`state`}
            />
            <CustomSelect
              my={5}
              label="City"
              placeholder="Select City"
              options={cities.map((city) => ({
                value: city.city_name,
                ...city,
              }))}
              value={selectedCity}
              setValue={setSelectedCity}
              disabled={!selectedProvince}
              name={`city`}
            />
            <CustomSelect
              my={5}
              label="Barangay"
              placeholder="Select Barangay"
              options={barangays.map((barangay) => ({
                value: barangay.brgy_name,
                ...barangay,
              }))}
              value={selectedBarangay}
              setValue={setSelectedBarangay}
              disabled={!selectedCity}
              name={`barangay`}
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
            <Text
              style={styles.title}
            >
              Account Information
            </Text>
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
          </View>
        </View>
        <Button
              appearance="filled"
              style={styles.buttonStyle}
              onPress={handleSubmit(onSubmit)}
            >
              {() => <Text style={styles.textStyle}>SUBMIT</Text>}
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
          <Text style={{ color: "#8e8888", fontFamily: "Nunito-Bold", fontSize: 15, textAlign: "center", marginBottom: 20 }}>Developed by Data X 2024</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    marginTop: 10,
    marginBottom: 5,
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
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Nunito-Bold",  
    fontSize: 20, 
    color: "#fff" 
  },
})
export default Register;
