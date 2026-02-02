import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Control, useFieldArray } from 'react-hook-form';
import { TFeatureLiteWithIcon } from 'src/models/TFeature';
import IconSelector from '../icon_selector/IconSelector';
import './LiteFeaturesNestedForm.css';
type TProps = {
    control: Control<TReleaseForm>,
    index: number,
    setError: any,
    clearErrors: any,
    maxLength?: number,
    setSerieFeatures?: (features: TFeatureLiteWithIcon[]) => void,
    watch: any,

}

const LiteFeaturesNestedForm = ({ control, index, clearErrors, setError, maxLength = 100 }: TProps) => {
    const featuresFieldArray = useFieldArray({
        control,
        name: `series.${index}.features`,
        keyName: '_key',
    });

    const addFeature = () => {
        const tempId = Date.now() + Math.floor(Math.random() * 10);
        const newFeature: TFeatureLiteWithIcon = {
            id: tempId,
            title: '',
            description: '',
            icon: ''
        };
        featuresFieldArray.append(newFeature);
    };

    const removeFeature = (id: number) => {
        featuresFieldArray.remove(id)
    };


    return (
        <section className='features-nested-form'>
            <div style={{ margin: "20px 0 " }}>
                <Button disabled={featuresFieldArray.fields ? featuresFieldArray.fields.length === 3 : false} color='secondary' variant='outlined' onClick={addFeature}>Agregar Característica</Button>
            </div>
            <div>

                {featuresFieldArray.fields.map((field, keyIndex) => (
                    <Accordion defaultExpanded key={field.id}>
                        <AccordionSummary expandIcon={<GridExpandMoreIcon />} >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
                                <Typography>Característica {keyIndex + 1}</Typography>
                                <Button color='error' variant='contained' onClick={() => removeFeature(keyIndex)}>Eliminar característica</Button>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <LiteFeatureInput
                                key={field.id}
                                control={control}
                                index={keyIndex}
                                clearErrors={clearErrors} setError={setError} parentIndex={index} />
                        </AccordionDetails>
                    </Accordion>

                ))}
            </div>
        </section>
    );
};



export default LiteFeaturesNestedForm;




import { Card
 } from '@mui/material';
import { useController } from 'react-hook-form';
import { TReleaseForm } from 'src/forms/TReleaseForm';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';
import { GridExpandMoreIcon } from '@mui/x-data-grid';



interface TLiteFeatureInputProps {
    index: number;
    parentIndex: number,
    clearErrors: any,
    setError: any,
    control: Control<TReleaseForm>;

}


export const LiteFeatureInput: React.FC<TLiteFeatureInputProps> = ({
    control,
    index,
    setError,
    clearErrors,
    parentIndex
}) => {
    const { field: titleField, fieldState: titleState } = useController({
        control,
        name: `series.${parentIndex}.features.${index}.title`,
        rules: { maxLength: { value: 120, message: `Solo se admiten ${120} como máximo` } }
    });
    const { field: descriptionField, fieldState: descriptionState } = useController({
        control,
        name: `series.${parentIndex}.features.${index}.description`,
        rules: { maxLength: 220 }
    });

    const { field: iconField, fieldState: iconState } = useController({
        control,
        name: `series.${parentIndex}.features.${index}.icon`,
    });


    return (
        <Card sx={{ p: 2, mb: 2 }}>

            <Box display="flex" gap={3}>
                <Box flex="0 0 300px">
                    <IconSelector value={iconField.value} onChange={(selectedIcon) => iconField.onChange(selectedIcon)} />

                </Box>
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
