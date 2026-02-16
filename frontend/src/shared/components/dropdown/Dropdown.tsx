import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import './Dropdown.css';
type TDropDownProps<T> = {
    options: T[];
    renderOption: (option: T) => React.ReactNode;
    renderSelectedOption?: (option: T) => React.ReactNode;
    getOptionValue: (option: T) => string | number;
    onSelect: (value: string | number) => void;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string | number;
    className?:string;
};

const DropDown = <T,>({
    options,
    renderOption,
    renderSelectedOption = renderOption,
    getOptionValue,
    onSelect,
    disabled = false,
    placeholder = "Select an option",
    defaultValue = "",
    value,
    className= ""
}: TDropDownProps<T>) => {
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        onSelect(event.target.value as string | number);
    };
    return (
        <Select className={`dropdown ${className}`}
            defaultValue={defaultValue}
            displayEmpty
            onChange={handleChange}
            disabled={disabled}
            value={value}
            renderValue={(selected) => {
                if (!selected) return placeholder;
                const selectedOption = options.find(
                    (option) => getOptionValue(option) === selected
                );
                if (!selectedOption) return placeholder;
                return renderSelectedOption(selectedOption);
            }}
        >
            <MenuItem disabled value="">
                {placeholder}
            </MenuItem>
            {options.map((option, index) => (
                <MenuItem key={index} value={getOptionValue(option)}>
                    {renderOption(option)}
                </MenuItem>
            ))}
        </Select>
    );
};

export default DropDown;
