import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Image, Text as RNText } from 'react-native';
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
  const [selectedIndex, setSelectedIndex] = useState(null); // Initialize to null
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
          const flagPng = country.flags?.png || ''; // PNG flag URL
          return {
            code: callingCode,
            flag: flagPng, // PNG URL for flag image
            name: country.name.common, // Country name for internal use
          };
        }).filter(item => item.code);

        setOptions(countryOptions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country codes:', error);
        setLoading(false);
      }
    };

    fetchCountryCodes();
  }, []);

  const CustomSelectItem = ({ item }) => (
    <View style={styles.selectItem}>
      {item.flag ? (
        <Image
          source={{ uri: item.flag }}
          style={styles.flagImage}
        />
      ) : null}
      <RNText style={styles.selectItemText}>{item.name}</RNText>
    </View>
  );

  const renderSelectedValue = () => {
    const selectedOption = options[selectedIndex?.row || 0];
    return selectedOption ? (
      <View style={styles.selectItem}>
        {selectedOption.flag ? (
          <Image
            source={{ uri: selectedOption.flag }}
            style={styles.flagImage2}
          />
        ) : null}
        {/* <RNText style={styles.selectItemText}>{selectedOption.name}</RNText> */}
      </View>
    ) : (
      <RNText style={styles.selectItemText}>Select a country</RNText>
    );
  };

  return (
    <>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
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
                  style={styles.select}
                  selectedIndex={selectedIndex}
                  onSelect={(index) => {
                    setSelectedIndex(index);
                    const selectedOption = options[index.row];
                    onChange(selectedOption.code); // Pass the selected calling code to the field
                  }}
                  value={renderSelectedValue()} // Render custom selected value
                >
                  {options.map((item, index) => (
                    <SelectItem
                      key={index}
                      title={item.name} // Display country name
                      accessoryLeft={() => item.flag ? (
                        <Image
                          source={{ uri: item.flag }}
                          style={styles.flagImage}
                        />
                      ) : null}
                      style={styles.selectItem}
                    />
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
                placeholder="Enter number" // Placeholder for the input field
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
    marginBottom: 5,
    fontSize: 15,
    fontFamily: "Nunito-Bold",
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectContainer: {
    flex: 2,
    marginRight: 10, // Adjust spacing between Select and Input
  },
  select: {
    borderColor: '#000',
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 24,
    height: 16, // Adjust size as needed
    marginRight: 10, // Space between flag and country name
  },
  flagImage2: {
    width: 40,
    height: 20, // Adjust size as needed
    borderWidth: 1, // Border thickness
    borderColor: '#000', // Border color
    borderRadius: 4, // Optional: Rounded corners
  },
  selectItemText: {
    fontSize: 15,
  },
  inputContainer: {
    flex: 4,
  },
  input: {
    paddingVertical: 16,
  },
  focusedInput: {
    borderColor: 'red',
  },
});

export default CustomPhoneInput;
