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
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (value) {
      const index = options.findIndex(option => option.value === value.value);
      setSelectedIndex(index !== -1 ? new IndexPath(index) : null);
      console.log("selected index: ",index);
      console.log("selected value: ",value);
    }
  }, [value, options]);

  return (
    <View style={{ width: "100px", marginVertical: my }}>
      <Text category="label" style={{ color: "#009688", marginBottom: 5 }}>
        {label}{" "}
        <Text style={{ color: "#DC3545" }}>{isRequired ? "*" : null}</Text>
      </Text>
      <Select
        style={styles.select}
        placeholder={placeholder}
        selectedIndex={selectedIndex}
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
  
});
