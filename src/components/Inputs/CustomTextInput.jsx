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
  // const [passwordVisible, setPasswordVisible] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible(!passwordVisible);
  // };

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={label}
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
  input: {
    height: 70, 
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 4,
  },
  focusedInput: {
    borderColor: 'red', 
  },
});

export default CustomTextInput;
