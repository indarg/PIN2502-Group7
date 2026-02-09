import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Card, IconButton, TextField } from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { TReleaseForm } from 'src/forms/TReleaseForm';
import { TAttribute } from 'src/models/TAttribute';
import './AttributeItem.css';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';
type TProps =
    | {
        typeForm: 'release';
        control: Control<TReleaseForm>;
        index?: number;
        onRemove?: () => void;
        attribute?: TAttribute;
        parentField?: string,
        setError: any,
        clearErrors: any,
    }
    | {
        typeForm: Exclude<string, 'release'>;
        control: Control<any>;
        index: number;
        onRemove: () => void;
        attribute?: TAttribute;
        parentField?: string,
        setError: any,
        clearErrors: any,
    };

const AttributeItem = ({ typeForm = 'release', index, onRemove, attribute, control, parentField = 'attributes', setError, clearErrors }: TProps) => {
    const { field: titleField, fieldState: titleState } = useController({
        control,
        name: `${parentField}.${index}.title`,
    });

    const { field: descriptionField, fieldState: descriptionState } = useController({
        control,
        name: `${parentField}.${index}.description`,
    });

    return (
        <Card sx={{ p: 2, mb: 2 }} >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton onClick={onRemove} color="error" size="small" title='Eliminar'>
                    <DeleteIcon />
                </IconButton>
            </Box>
            <Box flex={1} gap={3}>
                <TextField
                    {...titleField}
                    label="Titulo *"
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!titleState.error}
                    helperText={titleState.error?.message}
                />
                <RichtextEditorV2
                    field={descriptionField}
                    error={descriptionState.error}
                    clearErrors={clearErrors}
                    setError={setError}
                    fieldName={descriptionField.name}
                    maxLength={800}
                    placeholder={"Ingrese la descripción"}
                />
            </Box>

        </Card>
    );
};

export default AttributeItem;
