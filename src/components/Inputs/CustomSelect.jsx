import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Layout,
  Select,
  SelectItem,
  Text,
  IndexPath,
} from "@ui-kitten/components";

export const CustomSelect = ({
  my,
  label,
  isRequired,
  placeholder,
  options,
  value,
  setValue,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const displayValue = options[selectedIndex.row];

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
          <Text style={{ color: "#DC3545" }}>{isRequired ? "*" : null}</Text>
        </Text>
      )}
      value={displayValue}
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        setValue(index.row);
      }}
    >
      {options.map((item, index) => {
        return <SelectItem key={index} title={item} />;
      })}
    </Select>
  );
};

const styles = StyleSheet.create({});
