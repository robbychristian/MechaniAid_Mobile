import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CustomSelect } from "../../components/Inputs/CustomSelect";
import { api } from "../../../config/api";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Select, SelectItem, Text } from "@ui-kitten/components";
import { Surface } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import FormButtons from "../../components/Buttons/FormButtons";
import { Toast } from "toastify-react-native";
import { useDispatch, useSelector } from "react-redux";
import { addMedicineRequest } from "../../store/requests/Requests";

const AddRequest = () => {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
  const options = ["1:Health Care", "2:Health Care 2"];
  const navigation = useNavigation();
  const [selectedHealthCare, setSelectedHealthCare] = useState("");
  const [prescription, setPrescription] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [healthCares, setHealthCares] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicine",
  });

  const onSubmit = async (data) => {
    if (prescription == null) {
      Toast.error("Please upload your prescription");
    } else {
        const formdata = new FormData()
        const newFile = {
            uri: prescription.uri,
            type: "multipart/form-data",
            name: prescription.name,
          };
        const healthCare = data.health_care
        const healthCareId = healthCare.split(':')
        formdata.append('health_care', healthCareId[0])
        formdata.append('prescription_image', newFile)
        formdata.append('medicine', data.medicine)
        
        try {
            const response = await dispatch(addMedicineRequest(formdata))
            if (response.type == 'requests/addmedicinerequest/fulfilled') {
                Toast.success("Request has been submitted!")
                navigation.goBack()
            } else {
                Toast.error("There was an error submitting your request!")
            }
        } catch(err) {
            console.log(err)
            Toast.error("There was an error submitting your request!")
        }
    }
  };

  useEffect(() => {
    console.log(user)
    api
    .get("healthcarecenter/getallhealthcares")
    .then((response) => {
        const hc = response.data;
        let temp = [];
        hc.map((item) => {
            temp.push(`${item.id}:${item.health_care_name}`);
        });
        console.log(temp);
        setHealthCares(temp);
    })
    .catch((err) => {
        console.log(err.response);
    });
    const unsubscribe = navigation.addListener("focus", () => {
        console.log(user)
      api
        .get("healthcarecenter/getallhealthcares")
        .then((response) => {
          const hc = response.data;
          let temp = [];
          hc.map((item) => {
            temp.push(`${item.id}:${item.health_care_name}`);
          });
          console.log(temp);
          setHealthCares(temp);
        })
        .catch((err) => {
          console.log(err.response);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      Toast.success("File has been added!");
      setPrescription(result.assets[0]);
    } catch (err) {
      Toast.error("Please choose a file!");
    }
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
          <View style={{ justifyContent: "center" }}>
            <Controller
              name="health_care"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <Select
                      accessibilityLabel="time unit"
                      value={value}
                      label={`Health Care`}
                      onSelect={(index) => {
                        onChange(healthCares[index.row]);
                      }}
                    >
                      {healthCares.map((timeUnit) => (
                        <SelectItem
                          key={`select-option-${timeUnit}`}
                          title={timeUnit}
                        />
                      ))}
                    </Select>
                  </>
                );
              }}
            />
            {fields.length > 0
              ? fields.map((item, index) => (
                  <View style={{ marginTop: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "700" }}>
                        Medicine {index + 1}
                      </Text>
                      <TouchableOpacity onPress={() => remove(index)}>
                        <Text category="label" status="danger">Remove</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <CustomTextInput
                        control={control}
                        rules={{ required: true }}
                        name={`medicine.${index}.medicine_name`}
                        errors={errors}
                        label={`Medicine Name`}
                        message={`Medicine Name is required`}
                        isFull={false}
                        my={5}
                      />
                      <CustomTextInput
                        control={control}
                        rules={{ required: true }}
                        name={`medicine.${index}.medicine_brand_name`}
                        errors={errors}
                        label={`Medicine Brand Name`}
                        isFull={false}
                        message={`Medicine Brand Name is required`}
                        my={5}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <CustomTextInput
                        control={control}
                        rules={{ required: true }}
                        name={`medicine.${index}.medicine_dose`}
                        errors={errors}
                        label={`Medicine Dose`}
                        isFull={false}
                        message={`Medicine Dose is required`}
                        my={5}
                      />
                      <CustomTextInput
                        control={control}
                        rules={{ required: true }}
                        name={`medicine.${index}.medicine_quantity`}
                        errors={errors}
                        label={`Medicine Quantity`}
                        isFull={false}
                        message={`Medicine Quantity is required`}
                        my={5}
                      />
                    </View>
                  </View>
                ))
              : null}
            <View style={{ marginTop: 10 }}>
              <Button onPress={uploadFile}>
                {prescription !== null
                  ? "Update Prescription Image"
                  : "Add Prescription Image"}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
      <Surface
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
        elevation={1}
      >
        <FormButtons
          buttonColor={"#009688"}
          text={"ADD REQUEST"}
          textColor={"#fff"}
          onPress={handleSubmit(onSubmit)}
          my={4}
        />
        <FormButtons
          buttonColor={"#009688"}
          text={"ADD MEDICINE"}
          textColor={"#fff"}
          onPress={() => {
            append({
              medicine_name: "",
              medicine_brand_name: "",
              medicine_dose: "",
              medicine_quantity: "",
            });
          }}
          my={4}
        />
        <FormButtons
          buttonColor={"#fff"}
          text={`CANCEL`}
          textColor={"#009688"}
          my={4}
          borderColor={"#009688"}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Surface>
    </View>
  );
};

export default AddRequest;
