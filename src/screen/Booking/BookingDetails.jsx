import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Button, Select, SelectItem, Text } from "@ui-kitten/components";
import { View, StyleSheet, Image, ScrollView, BackHandler, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { IconButton, Card } from "react-native-paper";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import CustomMultiSelect from "../../components/Inputs/CustomMultiSelect";
import CustomSimpleSelect from "../../components/Inputs/CustomSimpleSelect";

import { Ionicons } from "@expo/vector-icons";

const BookingDetails = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    resetField
  } = useForm();

  const navigation = useNavigation();

  const [selectedTitles, setSelectedTitles] = useState([]);

  const updateFormState = (newSelectedTitles, onChange) => {
    setSelectedTitles(newSelectedTitles);
    onChange(newSelectedTitles);
  };

  const removeSelectedItem = (title, onChange) => {
    const newSelectedTitles = selectedTitles.filter((item) => item !== title);
    updateFormState(newSelectedTitles, onChange);

    if (title === "Other") {
      resetField("other_service_type");
    }
  };

  const showCustomTextInput = selectedTitles.includes("Other");


  const serviceOptions = [
    { title: "Oil Change", value: "oil_change" },
    { title: "Tire Replacement", value: "tire_replacement" },
    { title: "Brake Inspection", value: "brake_inspection" },
    { title: "Other", value: "other" },
  ];

  const vehicleTypes = [
    { title: "Car", valueType: "Car" },
    { title: "Motorcycle", valueType: "Motorcycle" },
  ];

  const paymentMethods = [
    { title: "Cash", valueType: "Cash" },
    { title: "Cashless", valueType: "Cashless" },
  ];

  const onSubmit = (data) => {
    navigation.navigate("Booking", {
      service_type: data.service_type,
      vehicle_type: data.vehicle_type,
      vehicle_name: data.vehicle_name,
      mode_of_payment: data.mode_of_payment,
      other: data.other_service_type || ""
    });

    const objects = [
      { service_type: data.service_type },
      { vehicle_type: data.vehicle_type },
      { vehicle_name: data.vehicle_name },
      { mode_of_payment: data.mode_of_payment },
      { other: data.other_service_type || "" }
    ];

    console.log(objects);
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <IconButton
            icon={() => <Ionicons name="arrow-back" size={30} color="black" />}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.title}>Booking Details</Text>
        </View>
        <Text style={styles.subtitle}>What should we fix today?</Text>
        <Image
          source={require("../../../assets/repair.png")}
          style={styles.image}
        />

        <Card style={styles.card}>
          {/* <CustomMultiSelect
            control={control}
            errors={errors}
            label={`Service Type`}
            message={`Please select at least one service`}
            my={5}
            name={`service_type`}
            options={serviceOptions}
            rules={{ required: true }}
            isFull={true}
          /> */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur } }) => (
              <>
              <Text style={styles.label}>Service Type</Text>
              <Select
                value={selectedTitles.join(", ")}
                onSelect={(index) => {
                  const selectedOption = serviceOptions[index.row];
                  const newSelectedTitles = [...selectedTitles];
                  const valueIndex = newSelectedTitles.indexOf(selectedOption.title);

                  if (valueIndex > -1) {
                    // If title is already selected, remove it
                    newSelectedTitles.splice(valueIndex, 1);
                  } else {
                    // If title is not selected, add it
                    newSelectedTitles.push(selectedOption.title);
                  }

                  updateFormState(newSelectedTitles, onChange);
                }}
                onBlur={onBlur}
                style={[styles.input]}
              >
                {serviceOptions.map((option, idx) => (
                  <SelectItem key={idx} title={option.title} />
                ))}
              </Select>
              </>
            )}
            name={"service_type"}
          />
          {errors["service_type"] && (
            <Text status="danger" category="label" style={{ marginVertical: 5 }}>
              Please select at least one service
            </Text>
          )}
          <Text style={styles.selectedItemsLabel}>Selected Services:</Text>
          <View style={styles.selectedItemsContainer}>
            {selectedTitles.length > 0 ? (
              selectedTitles.map((title) => (
                <View key={title} style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>{title}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      removeSelectedItem(title, (newSelectedTitles) => {
                        control._formValues["service_type"] = newSelectedTitles;
                      });
                    }}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noItemsTextContainer}>
                <Text style={styles.noItemsText}>No items selected</Text>
              </View>
            )}
          </View>
          {showCustomTextInput && (
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Other Service Type`}
              message={`This field is required`}
              my={5}
              name={`other_service_type`}
              rules={{ required: true }}
            />
          )}
          <CustomSimpleSelect
            control={control}
            errors={errors}
            label={`Vehicle Type`}
            message={`Please select a vehicle type`}
            my={5}
            name={`vehicle_type`}
            options={vehicleTypes}
            rules={{ required: true }}
            isFull={true}
          />

          <CustomTextInput
            control={control}
            errors={errors}
            label={`Vehicle Name`}
            message={`Vehicle Name is required`}
            my={5}
            name={`vehicle_name`}
            rules={{ required: true }}
          />

          <CustomSimpleSelect
            control={control}
            errors={errors}
            label={`Payment Method`}
            message={`Please select a payment method`}
            my={5}
            name={`mode_of_payment`}
            rules={{ required: true }}
            options={paymentMethods}
            isFull={true}
          />

          <Text style={styles.hintText}>
            * Initial cost of booking a mechanic is P100 and may vary depending
            on the problem assessed by the mechanic.
          </Text>
        </Card>

        <Button
          appearance="filled"
          style={styles.buttonStyle}
          onPress={handleSubmit(onSubmit)}
        >
          {() => <Text style={styles.textStyle}>PROCEED</Text>}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontFamily:"Nunito-Bold"
  },
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  innerContainer: {
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    marginLeft: 10,
  },
  subtitle: {
    fontFamily: "Nunito-Light",
    fontSize: 15,
    marginVertical: 5,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 25,
  },
  card: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
  },
  hintText: {
    marginTop: 10,
    fontSize: 12,
    color: "#8f9bb3",
  },
  backButton: {
    padding: 0,
  },
  buttonStyle: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 50,
    borderColor: "#EF4141",
    backgroundColor: "#EF4141",
    borderRadius: 50,
    paddingVertical: 15,
  },
  textStyle: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#fff",
  },
  input: {
    height: 70,
  },
  selectedItemsLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4141",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedItemText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 10,
    fontFamily: "Nunito-Bold",
  },
  removeButton: {
    padding: 5,
  },
  noItemsText: {
    fontSize: 14,
    color: "#8f9bb3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  noItemsTextContainer: {
    flex: 1, // Take up all available space
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
});

export default BookingDetails;
