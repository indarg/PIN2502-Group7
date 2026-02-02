import { Stack } from '@mui/material';
import React from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UtilService from 'src/services/UtilService';
import './RichtextEditorV2.css';
import { ControllerRenderProps, FieldError } from 'react-hook-form';

interface RichtextEditorV2Props {
  maxLength?: number;
  placeholder?: string;
  maxWidth?: string;
  field?: ControllerRenderProps<any, any>; // Para React Hook Form
  error?: FieldError; // Para mostrar errores
  // Props legacy (mantener compatibilidad)
  sendData?: (data: string) => void;
  initialValue?: string;
  onChange?: (value: string) => void;
  setError?: any;
  clearErrors?: any;
  fieldName?: string;
}

const RichtextEditorV2: React.FC<RichtextEditorV2Props> = ({ 
  field,
  error,
  maxLength = 800, 
  placeholder = "Ingrese texto",
  maxWidth = "auto",
  sendData, 
  initialValue = "", 
  onChange, 
  setError, 
  fieldName, 
  clearErrors 
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  const handleQuillChange = (value: string, delta: any, source: any, editor: UnprivilegedEditor) => {
    const plainTextLength = editor.getText().trimEnd().length;
    
    if (plainTextLength <= maxLength) {
      const encodedValue = UtilService.encodeBase64Unicode(value);
      
      // React Hook Form integration
      if (field) {
        field.onChange(encodedValue);
      }
      
      // Legacy support
      if (onChange) {
        onChange(encodedValue);
      }
      if (sendData) {
        sendData(encodedValue);
      }
      if (clearErrors && fieldName) {
        clearErrors(fieldName);
      }
    } else {
      if (setError && fieldName) {
        setError(fieldName, {
          type: "maxLength",
          message: `Solo se admiten ${maxLength} caracteres como máximo`,
        });
      }
    }
  };

  const getDisplayValue = () => {
    if (field?.value) {
      return UtilService.decodeBase64Unicode(field.value);
    }
    return UtilService.decodeBase64Unicode(initialValue);
  };
  return (
    <Stack className='rich-text-editor-v2' sx={{ width: '100%', marginBottom: 1, minWidth: "var(--m-w)", maxWidth }}>
      <Stack>
        <ReactQuill
          placeholder={placeholder}
          theme="snow"
          value={getDisplayValue()}
          onChange={handleQuillChange}
          onBlur={field?.onBlur}
          modules={modules}
          formats={formats}
          style={{ 
            minWidth: '90%', 
            color: "black", 
            border: (error && error.message) ? '1px solid #d32f2f' : undefined 
          }}
        />
        {/* Error message */}
        {error && (
          <Stack sx={{ mt: 0.5, color: 'error.main', fontSize: '0.75rem' }}>
            {error.message}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default RichtextEditorV2;