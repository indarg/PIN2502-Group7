import { Check } from '@mui/icons-material';
import { Box, Chip, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import '../Dropdown.css';
// R = return value of GetOptionValue function, if the type R doesn't come, it will be replace by the type T 
type TDropDownProps<T, R = T> = {
    options: T[];
    renderOption: (option: T) => React.ReactNode;
    getOptionValue: (option: T) => R;
    onSelect?: (value: T[]) => void;
    getLabel: (value: T) => string;
    defaultValue?: T[];
    placeholder?: string;
    disabled?: boolean;
    value?: T[];
    valueToFilter?: string,
};

const MultiDropDownGeneric = <T,>({
    options,
    renderOption,
    getOptionValue,
    getLabel,
    onSelect,
    disabled,
    placeholder = "Select an option",
    defaultValue = [],
    valueToFilter = "id",
    value
}: TDropDownProps<T>) => {
    const [values, setValues] = useState<T[]>(value || defaultValue);





    const handleChange = (event: SelectChangeEvent<any>) => {
        const { target: { value } } = event;
        if (!value || value.length === 0) {
            setValues([]);
            if (onSelect) {
                onSelect([]);
            }
            return;
        }

        const valueCounts = value.reduce((acc: Record<string, number>, curr: any) => {
            const key = (curr as any)[valueToFilter];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const hasDuplicates = Object.values(valueCounts).some(count => count as any > 1);

        if (hasDuplicates) {
            const updatedValues = values.filter(v => valueCounts[(v as any)[valueToFilter]] === 1);
            setValues(updatedValues);
            if (onSelect) {
                onSelect(updatedValues);
            }
        } else {
            setValues(value as T[]);
            if (onSelect) {
                onSelect(value as T[]);
            }
        }
    };




    const renderLabel = (selectedValue: T) => {
        const item = options.find((item) => (item as any)[valueToFilter] == (selectedValue as any)[valueToFilter]);
        return item ? getLabel(item) : "NOT FOUND";
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
                    {selected?.map((selectedValue, index) => (
                        <Chip
                            key={index}
                            label={renderLabel(selectedValue)}
                        />
                    ))}
                </Box>
            )}
        >
            <MenuItem disabled value={[]}>
                {placeholder}
            </MenuItem>
            {options.map((option, index) => (
                <MenuItem key={index} value={getOptionValue(option) as any} >
                    <div className="flex-row space-between" style={{ width: '100%' }}>
                        {renderOption(option)}
                        {values.find(v => (v as any)[valueToFilter] === (option as any)[valueToFilter]) &&
                            <Check />
                        }
                    </div>
                </MenuItem>
            ))}
        </Select>
    );
};

export default MultiDropDownGeneric;
