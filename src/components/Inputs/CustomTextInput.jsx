import { Input, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';

const CustomTextInput = ({
  control,
  rules = {},
  label,
  secureTextEntry,
  name,
  errors,
  message,
  my,
  isFull = true
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
    {label && (
        <Text style={styles.label}>{label}</Text> // Display the label above the inputs
      )}
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            secureTextEntry={secureTextEntry}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            value={value}
            style={[
              styles.input,
              { width: isFull ? '100%' : '47%' },
              isFocused && styles.focusedInput
            ]}
          />
        )}
        name={name}
      />
      {errors[name] && (
        <Text status="danger" category="label" style={{ marginVertical: my }}>
          {message}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontFamily:"Nunito-Bold"
  },
  input: {
    height: 70, 
    borderWidth: 1,
    borderColor: '#E4E9F2',
    // borderRadius: 15,
  },
  focusedInput: {
    borderColor: 'red', 
  },
});

export default CustomTextInput;
