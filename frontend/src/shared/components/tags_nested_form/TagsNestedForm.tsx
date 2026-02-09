import { Close } from '@mui/icons-material';
import { Box, Chip, FormControl, MenuItem, Select } from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Control } from 'react-hook-form';
import "react-quill/dist/quill.snow.css";
import { useCRMTag } from 'src/context/CRMTagContext/useCRMTag';
import { TTag } from 'src/models/TTag';
import './TagsNestedForm.css';

type TProps = {
    getValues: any, // function from react hook forms
    setValue: any,
    field?: string // function from react hook forms
}



const TagsNestedForm: FC<TProps> = ({ setValue, getValues, field = "tags" }: TProps) => {
    const { allTags } = useCRMTag();
    const [selectedTags, setSelectedTags] = useState<TTag[]>(getValues(field));

    const handleSelectTag = (tagId: number) => {
        const tag = allTags.find((t) => t.id === tagId);
        if (tag && !selectedTags.some((t) => t.id === tag.id)) {
            const updatedTags = [...selectedTags, tag];
            setSelectedTags(updatedTags);
        }
    };
    const handleRemoveTag = (tagId: number) => {
        const updatedTags = selectedTags.filter((tag) => tag.id !== tagId);
        setSelectedTags(updatedTags);
    };

    useEffect(() => {
        setValue(field, selectedTags)
    }, [selectedTags])

    const selectedIds = selectedTags.map((tag) => tag.id);
    return (
        <section className='tags-nested-form'>

            <div>
                <FormControl fullWidth margin="normal">
                    <Select
                        labelId="tags-label"
                        value=""
                        onChange={(e) => handleSelectTag(Number(e.target.value))}
                    >
                        {allTags
                            .filter((tag) => !selectedIds.includes(tag.id))
                            .map((tag, index) => (
                                <MenuItem sx={{ textTransform: "capitalize" }} key={index} value={tag.id}>
                                    {tag.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Mostrar tags seleccionados como Chips */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                    {selectedTags.map((tag, index) => (
                        <Chip
                            sx={{ textTransform: "capitalize" }}
                            key={index}
                            label={tag.name}
                            onDelete={() => handleRemoveTag(tag.id)}
                            deleteIcon={<Close />}
                        />
                    ))}
                </Box>
            </div>

        </section >);


}

export default TagsNestedForm;