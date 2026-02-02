import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { FC, SetStateAction } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { TColumn } from 'src/models/TColumn';
import useObjectImageUploadV2 from 'src/shared/hooks/useObjectImageUploadV2';
import UploadFileBox from '../upload_file_box/UploadFileBox';
import './ColumnsNestedForm.css';

type ColumnsNestedForm = {
  field?: string;
  columnsImageBlobMap: Record<string, Blob>;
  setColumnsImageBlobMap: (value: SetStateAction<Record<string, Blob>>) => void;
  columnsCroppedImages: Record<string, string | null>;
  setColumnsCroppedImages: (value: SetStateAction<Record<string, string | null>>) => void;
  setError: any;
  clearErrors: any;
  watch: any;
  control:Control<TReleaseForm>;
};



const ColumnsNestedFormRelease = ({ setError, clearErrors, control, field = "columns", columnsCroppedImages, setColumnsCroppedImages, columnsImageBlobMap, setColumnsImageBlobMap, watch }: ColumnsNestedForm) => {


  const columnFileUpload = useObjectImageUploadV2(columnsCroppedImages, setColumnsCroppedImages, columnsImageBlobMap, setColumnsImageBlobMap);
  const columnsFieldArray = useFieldArray({
    control,
    name: 'columns',
    keyName: '_key',
  });
  const watchedColumns = watch(field);


  const addColumn = () => {
    const tempId = Date.now() + Math.floor(Math.random() * 10);
    const newColumn: TColumn = {
      id: tempId,
      title: '',
      body: '',
      image: {
        id: tempId,
        fileUrl: '',
        title: '',
        mediaType: 'image',
        description: '',
        fileFormat: '',
        fileSize: 0,
      },
    };
    columnsFieldArray.append(newColumn);
  };


  const removeColumn = (index: number, id: number) => {
    columnFileUpload.removeImage(id);
    if (watchedColumns[index]?.media?.preview) {
      URL.revokeObjectURL(watchedColumns[index].media.preview);
    }
    columnsFieldArray.remove(index);
  };

  return (
    <section className='columns-nested-form'>
      <div style={{ margin: "40px 0" }}>
        <Button color='secondary' variant='outlined' onClick={addColumn}>Agregar Columna</Button>
      </div>
      <div>
        {columnsFieldArray.fields.map((field, index) => (
          <Accordion defaultExpanded key={field.id}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />} >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%" }}>
                <Typography>Columna {index + 1}</Typography>
                <Button color='error' variant='contained' onClick={() => removeColumn(index, field.id)}>Eliminar columna</Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <ColumnInput
                key={field.id}
                control={control}
                index={index}
                column={watchedColumns[index]}
                onFileChange={(e, id) => {
                  columnFileUpload.handleFileChange(e, field.id ?? 0);
                }}
                getDialogOpen={(id) => columnFileUpload.getDialogOpen(field.id ?? 0)}
                onCropComplete={(blob, id) => {
                  columnFileUpload.handleCropComplete(blob, field.id ?? 0);
                }}
                closeCropper={() => columnFileUpload.setDialogOpenMap((prev) => ({ ...prev, [field.id ?? 0]: false }))}
                imageSrc={columnFileUpload.imageSrcMap[field.id ?? 0] || ''}
                croppedImage={columnsCroppedImages[field.id ?? 0] || null}
                clearErrors={clearErrors} setError={setError}
              />
            </AccordionDetails>
          </Accordion>

        ))}

      </div>
    </section>
  );
};





export default ColumnsNestedFormRelease;



import { Card } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { ChangeEvent } from 'react';
import { useController } from 'react-hook-form';
import { FormTColumn, TReleaseForm } from 'src/forms/TReleaseForm';
import RichtextEditorV2 from '../richtext_editor/RichtextEditorV2';



interface TCommonColumnInputProps {
  index: number;
  clearErrors: any,
  setError: any,
  onFileChange: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
  column: FormTColumn;
  getDialogOpen: (id: number) => boolean;
  onCropComplete: (blob: Blob, id: number) => void;
  closeCropper: () => void;
  imageSrc: string;
  croppedImage: string | null;
  control:Control<TReleaseForm>
}



export const ColumnInput: FC<TCommonColumnInputProps> = ({
  control,
  index,
  onFileChange,
  column,
  getDialogOpen,
  onCropComplete,
  closeCropper,
  imageSrc,
  croppedImage,
  setError,
  clearErrors,
}) => {
  const { field: titleField, fieldState: titleState } = useController({
    control,
    name: `columns.${index}.title`,
    rules: { maxLength: { value: 120, message: `Solo se admiten ${120} como máximo` } }
  });

  const { field: bodyField, fieldState: bodyState } = useController({
    control,
    name: `columns.${index}.body`,
    rules: { maxLength: 1000 }
  });


  const getPreviewUrl = () => {
    if (croppedImage) return croppedImage;
    if (column.image.preview) return column.image.preview;
    if (column.image.fileUrl) return column.image.fileUrl;
    return '';
  };

  const handleFileChangeWrapper = (e: ChangeEvent<HTMLInputElement>) => {
    onFileChange(e, index);
  };

  const handleCropCompleteWrapper = (blob: Blob) => {
    onCropComplete(blob, index);
  };

  const previewUrl = getPreviewUrl();

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color={column.image.isExisting ? 'primary' : 'secondary'}>
          {column.image.isExisting ? '📁 Columna existente' : '📄 Nueva columna'} #{index + 1}
        </Typography>

      </Box>

      <Box display="flex" gap={3}>
        <Box flex="0 0 300px">
          <UploadFileBox
            croppedImage={previewUrl}
            handleFileChange={handleFileChangeWrapper}
            open={getDialogOpen(index)}
            close={closeCropper}
            onCropComplete={handleCropCompleteWrapper}
            imageSrc={imageSrc}
            cropType="square"
          />
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
            <Typography variant="subtitle1" color='info' >Cuerpo <small>Opcional</small></Typography>
            <RichtextEditorV2
              field={bodyField}
              error={bodyState.error}
              clearErrors={clearErrors}
              setError={setError}
              fieldName={bodyField.name}
              maxLength={1000}
              placeholder={"Ingrese texto"}
            />
          </Grid>
          <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="caption" color="textSecondary">
              Estado: {column.image.isExisting ? 'Medio existente' : 'Nueva carga'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};