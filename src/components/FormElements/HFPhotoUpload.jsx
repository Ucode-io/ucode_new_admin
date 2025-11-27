import { FormHelperText } from '@mui/material';
import React from 'react'
import { Controller } from 'react-hook-form';
import ImageUpload from '../Upload/ImageUpload';

export default function HFPhotoUpload({
  control,
  name,
  required,
  tabIndex,
  updateObject,
  isNewTableView = false,
  rules,
  disabledHelperText = false,
  disabled,
  field,
  ...props
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <ImageUpload
            name={name}
            value={value}
            tabIndex={tabIndex}
            field={field}
            isNewTableView={isNewTableView}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}
    ></Controller>
  );
}
