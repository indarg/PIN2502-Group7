// CropImageTool.tsx
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Slider } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

interface CropImageToolProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
  isGif?: boolean;
}

const CropImageTool: FC<CropImageToolProps> = ({ open, imageSrc, onClose, onCropComplete, isGif }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(16/9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  useEffect(() => { }, [imageSrc, open]);
  
  const onCropCompleteInternal = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleCrop = async () => {
    if (isGif) {
      // For GIFs, convert the original image to blob without cropping
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      onCropComplete(blob);
    } else {
      // For other formats, crop normally
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    }
    onClose();
  };
  
  const handleAcceptWithoutCrop = async () => {
    // Convert the original image to blob without any modifications
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    onCropComplete(blob);
    onClose();
  };

  // Handle aspect ratio change
  const handleAspectChange = (value: number) => {
    if (value === 0) {
      setAspect(undefined); // Free crop
    } else {
      setAspect(value);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isGif ? 'Vista previa de GIF' : 'Recorta la imagen'}
      </DialogTitle>
      <DialogContent>
        {isGif && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Los archivos GIF no se pueden recortar para preservar la animación. 
            Puedes usar la imagen original o cancelar.
          </Alert>
        )}
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect} // This will be undefined for free crop
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            cropShape={isGif ? 'rect' : 'rect'}
            showGrid={!isGif}
            style={{
              containerStyle: isGif ? { pointerEvents: 'none' } : {}
            }}
          />
        </div>
        {!isGif && (
          <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, z) => setZoom(z as number)} />
        )}
      </DialogContent>
      <DialogActions>
        <Button sx={{marginRight:"auto"}} onClick={onClose}>Cancelar</Button>
        {!isGif && (
          <Select
            value={aspect || 0} // Use 0 to represent free crop
            onChange={(e) => handleAspectChange(Number(e.target.value))}
          >
            <MenuItem value={16 / 9}>16:9</MenuItem>
            <MenuItem value={1}>1:1</MenuItem>
            <MenuItem value={4 / 3}>4:3</MenuItem>
            <MenuItem value={3 / 1}>3:1 (Banner)</MenuItem>
             <MenuItem value={4 / 1}>4:1 (Banner)</MenuItem>
            <MenuItem value={8 / 1}>8:1 (Banner)</MenuItem>
            <MenuItem value={7.8 / 1}>7.8:1 (Banner)</MenuItem>
            <MenuItem value={1.2 / 1}>1.2:1 (Banner)</MenuItem>
            <MenuItem value={0.27 / 1}>0.27:1 (Banner)</MenuItem>
            <MenuItem value={0}>Libre</MenuItem>
          </Select>
        )}
        
        {isGif ? (
          <Button onClick={handleAcceptWithoutCrop} variant="contained">
            Usar original
          </Button>
        ) : (
          <Button onClick={handleCrop} variant="contained">
            Recortar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// cropImageHelper.ts remains the same
import { Area } from 'react-easy-crop';

async function getCroppedImg(imageSrc: string, crop: Area, outputFormat?: string): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => { image.onload = resolve; });
  
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  
  ctx!.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  
  return new Promise(resolve => {
    // Use the specified format or default to JPEG for non-GIF images
    const format = outputFormat || 'image/jpeg';
    canvas.toBlob(blob => resolve(blob!), format);
  });
}

export {
  CropImageTool,
  // eslint-disable-next-line react-refresh/only-export-components
  getCroppedImg
};