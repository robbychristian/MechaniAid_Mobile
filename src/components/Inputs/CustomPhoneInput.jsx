import { Input, Text, Layout, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

const CustomPhoneInput = ({
  control,
  rules = {},
  label,
  secureTextEntry,
  name,
  errors,
  message,
  my,
  isFull = true,
  // placeholder,
  // options,
  // value,
  // setValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  
  // const displayValue = options[selectedIndex.row];
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Layout
            style={[styles.container, { width: isFull ? '100%' : '70%' }]}
          >
            <View style={styles.selectContainer}>
              <Select
                label={label}
                style={styles.select}
                // placeholder={placeholder}
                // value={displayValue}
                selectedIndex={selectedIndex}
                onSelect={(index) => {
                  setSelectedIndex(index);
                  // setValue(index.row);
                }}
              >
                {/* {options.map((item, index) => {
        return <SelectItem key={index} title={item} />;
      })} */}
                <SelectItem title='+63' />
                <SelectItem title='+1' /> 
                </Select>
            </View>
            <View style={styles.inputContainer}>
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
                isFocused && styles.focusedInput
              ]}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  selectContainer: {
    flex: 1,
    marginRight: -40,
  },
  select: {
    height: 70,
    // borderWidth: 1,
    borderColor: '#000',
    // alignSelf: 'flex-start',
    
  },
  inputContainer: {
    flex: 2,
    // borderWidth: 1,
    marginLeft: 45,
  },
  input: {
    height: 68,
    width: 235,
    borderRadius: 15,
    paddingVertical: 16,
    // marginRight:,
  },
  focusedInput: {
    borderColor: 'red',
  },
});

export default CustomPhoneInput;
