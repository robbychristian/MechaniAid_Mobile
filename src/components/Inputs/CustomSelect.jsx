import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Layout,
  Select,
  SelectItem,
  Text,
  IndexPath,
} from "@ui-kitten/components";
import axios from "axios";

export const CustomSelect = ({
  my,
  label,
  isRequired,
  placeholder,
  options,
  value,
  setValue,
  fetchData,
  loading,
  optionKey = 'name' // Default to 'name' if key is not provided
}) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const displayValue = options[selectedIndex.row] ? options[selectedIndex.row][optionKey] : '';

  useEffect(() => {
    if (fetchData) fetchData();
  }, [fetchData]);

  return (
    <Select
      style={{
        width: "100%",
        marginVertical: my,
        borderRadius: 10,
      }}
      placeholder={placeholder}
      label={() => (
        <Text category="label" style={{ color: "#009688" }}>
          {label}{" "}
          <Text style={{ color: "red" }}>{isRequired ? "*" : null}</Text>
        </Text>
      )}
      value={displayValue}
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        setValue(options[index.row]);
      }}
      disabled={loading}
    >
      {options.map((item, index) => (
        <SelectItem key={index} title={item[optionKey]} />
      ))}
    </Select>
  );
};
