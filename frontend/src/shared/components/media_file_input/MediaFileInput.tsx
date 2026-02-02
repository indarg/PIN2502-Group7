// components/MediaFileInput.tsx
import React, { ChangeEvent } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, Typography, IconButton, TextField, MenuItem, Card, CardMedia } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import UploadFileBox from '../upload_file_box/UploadFileBox';
import { FormTAdvertisement } from 'src/shared/hooks/fileUtils';
import { FormTMediaFile } from 'src/models/FormTMediaFile';


interface MediaFileInputProps {
  control: Control<FormTAdvertisement>;
  index: number;
  onRemove: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>,index:number) => void;
  file: FormTMediaFile;
  cropperState: {
    open: boolean;
    imageSrc: string;
    fileIndex: number;
    tempFile: File | null;
  };
  onCropComplete: (croppedBlob: Blob) => void;
  closeCropper: () => void;
}

export const MediaFileInput: React.FC<MediaFileInputProps> = ({
  control,
  index,
  onRemove,
  onFileChange,
  file,
  cropperState,
  onCropComplete,
  closeCropper,
}) => {
  const { field: titleField, fieldState: titleState } = useController({
    control,
    name: `ads.${index}.media.title`,
    rules: { required: 'Title is required' },
  });

  const { field: descriptionField } = useController({
    control,
    name: `ads.${index}.media.description`,
  });

  const { field: adsTypeField } = useController({
    control,
    name: `ads.${index}.media.mediaType`,
  });

  const getPreviewUrl = () => {
    if (file.preview) return file.preview;
    if (file.fileUrl) return file.fileUrl;
    return '';
  };

  const handleFileChangeWrapper = (e: ChangeEvent<HTMLInputElement>) => {
    onFileChange(e,index);
  };

  const previewUrl = getPreviewUrl();

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color={file.isExisting ? 'primary' : 'secondary'}>
          {file.isExisting ? '📁 Existing File' : '📄 New File'} #{index + 1}
        </Typography>
        <IconButton onClick={onRemove} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box display="flex" gap={3}>
        {/* File Upload Section */}
        <Box flex="0 0 300px">
          <UploadFileBox
            croppedImage={previewUrl}
            handleFileChange={handleFileChangeWrapper}
            open={cropperState.open && cropperState.fileIndex === index}
            close={closeCropper}
            onCropComplete={onCropComplete}
            imageSrc={cropperState.imageSrc}
            cropType="square"
          />
          
          {/* Preview existing image */}
          {previewUrl && (
            <Box mt={2}>
              <Typography variant="caption" display="block" gutterBottom>
                Current Image:
              </Typography>
              <CardMedia
                component="img"
                height="120"
                image={previewUrl}
                alt={file.title || 'Preview'}
                sx={{ 
                  objectFit: 'cover', 
                  borderRadius: 1,
                  border: file.isExisting ? '2px solid #1976d2' : '2px solid #9c27b0'
                }}
              />
            </Box>
          )}
        </Box>

        {/* Form Fields Section */}
        <Box flex={1}>
          <TextField
            {...titleField}
            label="Title *"
            fullWidth
            margin="normal"
            size="small"
            error={!!titleState.error}
            helperText={titleState.error?.message}
          />
          
          <TextField
            {...descriptionField}
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            size="small"
          />
          
          {/* <TextField
            {...mediaTypeField}
            select
            label="Media Type"
            fullWidth
            margin="normal"
            size="small"
          >
            <MenuItem value="image">🖼️ Image</MenuItem>
            <MenuItem value="video">🎥 Video</MenuItem>
            <MenuItem value="audio">🎵 Audio</MenuItem>
            <MenuItem value="document">📄 Document</MenuItem>
            <MenuItem value="other">📎 Other</MenuItem>
          </TextField> */}

          {/* File Info Display */}
          <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="caption" color="textSecondary">
              Status: {file.isExisting ? 'Existing file' : 'New upload'}
            </Typography>
            {file.fileSize && (
              <Typography variant="caption" display="block" color="textSecondary">
                Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
            {file.fileFormat && (
              <Typography variant="caption" display="block" color="textSecondary">
                Format: {file.fileFormat}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};