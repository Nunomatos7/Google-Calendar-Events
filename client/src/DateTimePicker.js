import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function DateTimePicker({ defaultValue, onChange }) {
  const handleDateTimeChange = (newValue) => {
    onChange(newValue); // Pass selected date/time to the parent component
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        value={defaultValue}
        onChange={(newValue) => handleDateTimeChange(newValue)} // Pass the selected date/time
        renderInput={(props) => <input {...props} />} // Render an input (customize as needed)
      />
    </LocalizationProvider>
  );
}
