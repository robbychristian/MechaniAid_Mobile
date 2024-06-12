import {Datepicker, Input, Text} from '@ui-kitten/components';
import moment from 'moment';
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
  const maxDate = new Date()
  const minDate = new Date(1900, 0, 0)
  maxDate.setFullYear(maxDate.getFullYear() - 18);
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
            max={maxDate}
            min={minDate}
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
