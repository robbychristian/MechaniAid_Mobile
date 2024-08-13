import { Select, SelectItem, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

const CustomSimpleSelect = ({
  control,
  rules = {},
  label,
  name,
  errors,
  message,
  my,
  options = [],
  isFull = true
}) => {
  const [selectedTitle, setSelectedTitle] = useState('');

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            label={label}
            value={value || 'Select an option'}
            onSelect={(index) => {
              const selectedOption = options[index.row];
              if (selectedOption) {
                const newValue = selectedOption.title;
                setSelectedTitle(newValue);
                onChange(newValue);
              }
            }}
            onBlur={onBlur}
            style={[
              styles.input,
              { width: isFull ? '100%' : '47%' },
            ]}
          >
            {options.map((option, idx) => (
              <SelectItem key={idx} title={option.title} />
            ))}
          </Select>
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
  },
});

export default CustomSimpleSelect;
