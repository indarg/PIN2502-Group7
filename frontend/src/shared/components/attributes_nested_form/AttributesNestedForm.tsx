import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { Control, useFieldArray } from 'react-hook-form';
import { TAttribute } from 'src/models/TAttribute';
import './AttributesNestedForm.css';
type TProps = {
    control: Control<TTeaserForm>,
    setError: any,
    clearErrors: any,
    maxLenghtTitle?: number,
    maxLengthDescription?: number,
    parentIndex:number
}

const AttributesNestedForm = ({ maxLenghtTitle=100, maxLengthDescription = 140,control,parentIndex,clearErrors,setError }: TProps) => {
    
    // useFieldArray para manejar el array de atributos
    const { fields, append, remove } = useFieldArray({
        control,
        name: `properties.${parentIndex}.attributes`,
        keyName: '_key' // Evita conflicto con el 'id' de TAttribute
    });
    const addAttribute = () => {
        const tempId = Date.now() + Math.floor(Math.random() * 10);
        const newAttribute: TAttribute = {
            id: tempId,
            title: '',
            description: '',
        };
        append(newAttribute);
    };

    const removeAttribute = (id: number) => {
        remove(id);
    };

    return (
        <section className='attributes-nested-form'>
            <Stack >
                <Button color='secondary' variant='outlined' onClick={addAttribute} disabled={fields && fields.length === 4}>Agregar Atributo</Button>
            </Stack>
            <div>
                {fields.map((feat, index) => {
                    return (
                        <Accordion defaultExpanded key={index}>
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
                                    <Typography>Atributo {index + 1}</Typography>
                                    <Button color='error' variant='contained' onClick={() => removeAttribute(index)}>Eliminar atributo</Button>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AttributeItemInput setError={setError} clearErrors={clearErrors} control={control} index={index} parentIndex={parentIndex}/>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        </section>
    );
};



export default AttributesNestedForm;





import {
    Card
} from '@mui/material';
import { useController } from 'react-hook-form';
import { TTeaserForm } from 'src/forms/TTeaserForm';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';

interface TAttributeItemInputProps {
    index: number;
    parentIndex: number,
    clearErrors: any,
    setError: any,
    control: Control<TTeaserForm>;
}

export const AttributeItemInput: React.FC<TAttributeItemInputProps> = ({
    control,
    index,
    setError,
    clearErrors,
    parentIndex
}) => {
    const { field: titleField, fieldState: titleState } = useController({
        control,
        name: `properties.${parentIndex}.attributes.${index}.title`,
        rules: {  maxLength: { value: 120, message: `Solo se admiten ${120} como máximo` } }
    });
    const { field: descriptionField, fieldState: descriptionState } = useController({
        control,
        name: `properties.${parentIndex}.attributes.${index}.description`,
        rules: { maxLength: 220 }
    });



    return (
        <Card sx={{ p: 2, mb: 2 }}>

            <Box display="flex" gap={3}>
                <Box flex={1}>
                    <Grid>
                        <TextField
                            {...titleField}
                            label="Titulo *"
                            fullWidth
                            margin="normal"
                            size="small"
                            error={!!titleState.error}
                            helperText={titleState.error?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant="subtitle1" color='info' >Descripción <small>Opcional</small></Typography>
                        <RichtextEditorV2
                            field={descriptionField}
                            error={descriptionState.error}
                            clearErrors={clearErrors}
                            setError={setError}
                            fieldName={descriptionField.name}
                            maxLength={220}
                            placeholder={"Ingrese texto"}
                        />
                    </Grid>

                </Box>
            </Box>
        </Card>
    );
};
