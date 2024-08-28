import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Input, Text, Layout } from '@ui-kitten/components';
import { Controller } from 'react-hook-form';

const CustomPhoneInput = ({
  control,
  rules = {},
  label, // Include the label prop here
  name,
  errors,
  message,
  my,
  isFull = true,
}) => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <>
      {label && (
        <Text style={styles.label}>{label}</Text> // Display the label above the inputs
      )}
      <Controller
        control={control}
        rules={{
          ...rules,
          minLength: {
            value: 10,
            message: "Mobile Number must be exactly 10 characters",
          },
          maxLength: {
            value: 10,
            message: "Mobile Number must be exactly 10 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Layout style={[styles.container, { width: isFull ? '100%' : '70%' }]}>
            <View style={styles.prefixContainer}>
              <Input
                value="+63"
                editable={false}
                disabled={true}
                style={[
                  styles.input,
                  styles.disabledInput,
                ]}
              />
            </View>
            <View style={styles.numberContainer}>
              <Input
                value={value}
                onChangeText={(text) => {
                  // Allow only numbers and limit to 10 digits
                  const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
                  onChange(formattedText);
                }}
                onBlur={onBlur}
                keyboardType="numeric"
                maxLength={10}
                style={styles.input}
              />
            </View>
          </Layout>
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
    fontSize: 15,
    fontFamily:"Nunito-Bold"
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefixContainer: {
    flex: 1,
    marginRight: 8,
  },
  numberContainer: {
    flex: 3,
  },
  input: {
    height: 68,
    paddingVertical: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // Optional: to give a "disabled" look
    color: '#a0a0a0', // Optional: change text color to indicate disabled state
  },
});

export default CustomPhoneInput;
