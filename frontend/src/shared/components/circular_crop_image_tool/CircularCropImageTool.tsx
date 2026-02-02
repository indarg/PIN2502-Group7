import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { getCroppedCircleImg } from 'src/shared/hooks/getCroppedCircleImg';

interface CircularCropImageToolProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

const CircularCropImageTool: FC<CircularCropImageToolProps> = ({ open, imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteInternal = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const croppedImage = await getCroppedCircleImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Recortar imagen de perfil</DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(_, value) => setZoom(value as number)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleCrop}>Recortar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CircularCropImageTool;
