import {Datepicker, Input, Text} from '@ui-kitten/components';
import React from 'react';
import {Controller} from 'react-hook-form';

const CustomDatePicker = ({
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
  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <Datepicker
            label={label}
            onSelect={onChange}
            onBlur={onBlur}
            date={value}
            style={{ width: isFull ? "100%" : '47%' }}
          />
        )}
        name={name}
      />
      {errors[name] && <Text status="danger" category='label' style={{ marginVertical: my }}>{message}</Text>}
    </>
  );
};

export default CustomDatePicker;
