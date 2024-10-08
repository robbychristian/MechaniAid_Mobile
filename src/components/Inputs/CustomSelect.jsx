import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Select, SelectItem, Text } from "@ui-kitten/components";
import { IndexPath } from "@ui-kitten/components";

export const CustomSelect = ({
  my,
  label,
  isRequired,
  placeholder,
  options,
  value,
  setValue,
  disabled,
  loading,
  name,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (value) {
      const index = options.findIndex(option => option.value === value.value);
      setSelectedIndex(index !== -1 ? new IndexPath(index) : null);
      console.log("selected index: ", index);
      console.log("selected value: ", value);
    }
  }, [value, options]);

  return (
    <View style={{ width: "100", marginVertical: my }}>
      {label && (
        <Text style={styles.label}>{label}</Text> // Display the label above the inputs
      )}
      <Select
        name={name}
        style={styles.select}
        placeholder={placeholder}
        selectedIndex={selectedIndex}
        value={value ? value.value : placeholder} // Display the selected value or the placeholder
        onSelect={(index) => {
          const selectedOption = options[index.row];
          setSelectedIndex(index);
          setValue(selectedOption); // Update the selected value
        }}
        disabled={disabled || loading}
      >
        {options.map((item, index) => (
          <SelectItem key={index} title={item.value} />
        ))}
      </Select>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontFamily:"Nunito-Bold"
  },
});
