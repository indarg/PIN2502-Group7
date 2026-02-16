import { Select, MenuItem, SelectChangeEvent, Box, Chip } from '@mui/material';
import '../Dropdown.css';
import { useState } from 'react';
import { Check } from '@mui/icons-material';

type TDropDownProps<T> = {
    options: T[];
    renderOption: (option: T) => React.ReactNode;
    getOptionValue: (option: T) => string | number;
    onSelect?: (value: string | number) => void;
    defaultValue?:string[];
    placeholder?: string;
    disabled?: boolean;
    value?: string[];
};

const MultiDropDown = ({
    options,
    renderOption,
    getOptionValue,
    onSelect,
    disabled,
    placeholder = "Select an option",
    defaultValue=[],
    value
}: TDropDownProps<{name: string, id: string}>) => {
    const [values, setValues] = useState<string[]>(value ? value : defaultValue);

    const handleChange = (event: SelectChangeEvent<typeof values>) => {
        const { target: { value } } = event;
        setValues(
            typeof value === "string" ? value.split(",") : value
        );
        if (onSelect)
            onSelect(event.target.value as string | number);
    };

    return (
        <Select
            defaultValue={defaultValue}
            displayEmpty
            multiple
            disabled={disabled}
            onChange={handleChange}
            value={values}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value,index) => (
                    <Chip 
                        key={value + index} 
                        label={options.find((item) => item.id == value)?.name ?? "NOT FOUND"} 
                    />
                  ))}
                </Box>
              )}
              >
            <MenuItem disabled value={[]}>
                {placeholder}
            </MenuItem>
            {options.map((option, index) => (
                <MenuItem key={index} value={getOptionValue(option)}>
                    <div className="flex-row space-between" style={{width: '100%'}}>
                        {renderOption(option)}
                        {values.includes(option.id) &&
                            <Check />
                        }
                    </div>
                </MenuItem>
            ))}
        </Select>
    );
};

export default MultiDropDown;
