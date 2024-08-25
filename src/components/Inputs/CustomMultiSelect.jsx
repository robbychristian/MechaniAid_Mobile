import { Select, SelectItem, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../../components/Inputs/CustomTextInput"; // Adjust the import path as needed

const CustomMultiSelect = ({
  control,
  rules = {},
  label,
  name,
  errors,
  message,
  my,
  options = [],
  isFull = true,
}) => {
  const [selectedTitles, setSelectedTitles] = useState([]);
  const { resetField } = useFormContext(); // Hook to reset the field

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

  return (
    <>
    {label && (
        <Text style={styles.label}>{label}</Text> // Display the label above the inputs
      )}
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur } }) => (
          <Select
            value={selectedTitles.join(", ")}
            onSelect={(index) => {
              const selectedOption = options[index.row];
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
            style={[styles.input, { width: isFull ? "100%" : "47%" }]}
          >
            {options.map((option, idx) => (
              <SelectItem key={idx} title={option.title} />
            ))}
          </Select>
        )}
        name={name}
      />
      {errors[name] && (
        <Text status="danger" category="label" style={{ marginVertical: my }}>
          {message}
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
                    control._formValues[name] = newSelectedTitles;
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
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontFamily:"Nunito-Bold"
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

export default CustomMultiSelect;
