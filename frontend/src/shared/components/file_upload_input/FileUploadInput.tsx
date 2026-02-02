import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from "src/shared/material_styles/InputStyles";
import { FC } from "react";

type TProps = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const InputFileUpload: FC<TProps> = ({ handleFileChange }) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Subir archivo
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        multiple
      />
    </Button>
  );
}

export default InputFileUpload;