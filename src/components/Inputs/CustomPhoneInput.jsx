import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Input, Text, Layout, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { Controller } from 'react-hook-form';

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
}) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        const countryOptions = sortedCountries.map(country => {
          const callingCode = (country.idd.root || '') + (country.idd.suffixes ? country.idd.suffixes[0] : '');
          return callingCode ? `${callingCode}` : null;
        }).filter(Boolean);

        setOptions(countryOptions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country codes:', error);
        setLoading(false);
      }
    };

    fetchCountryCodes();
  }, []);

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Layout style={[styles.container, { width: isFull ? '100%' : '70%' }]}>
            <View style={styles.selectContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Select
                  label={label}
                  style={styles.select}
                  selectedIndex={selectedIndex}
                  onSelect={(index) => {
                    setSelectedIndex(index);
                    onChange(options[index.row]);
                  }}
                  value={options[selectedIndex.row]}
                >
                  {options.map((item, index) => (
                    <SelectItem key={index} title={item} />
                  ))}
                </Select>
              )}
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
                  isFocused && styles.focusedInput,
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
    borderColor: '#000',
  },
  inputContainer: {
    flex: 2,
    marginLeft: 45,
  },
  input: {
    height: 68,
    width: 235,
    // borderRadius: 15,
    paddingVertical: 16,
  },
  focusedInput: {
    borderColor: 'red',
  },
});

export default CustomPhoneInput;
