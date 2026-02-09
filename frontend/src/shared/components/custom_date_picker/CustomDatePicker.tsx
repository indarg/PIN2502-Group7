// src/components/CustomDatePicker.jsx (o .tsx)
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function CustomDatePicker({ value, onChange, label, error, helperText }:any) {
    return (
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            format="dd/MM/yyyy" 
            slotProps={{
                textField: {
                    fullWidth: true,
                    error: error,
                    helperText: helperText,
                },
            }}
        />
    );
}
export default CustomDatePicker;