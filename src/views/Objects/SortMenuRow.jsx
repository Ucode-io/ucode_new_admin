import { MenuItem, Select } from "@mui/material";
import React from "react";

export default function SortMenuRow({ computedColumns, index, form, typeSorts }) {
  return (
    <>
      <Select sx={{ width: 200 }} value={form.watch(`sort[${index}].field`)} size="small" fullWidth onChange={(e) => form.setValue(`sort[${index}].field`, e.target.value)}>
        {computedColumns?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Select sx={{ width: 200 }} value={form.watch(`sort[${index}].order`)} size="small" fullWidth onChange={(e) => form.setValue(`sort[${index}].order`, e.target.value)}>
        {typeSorts?.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
